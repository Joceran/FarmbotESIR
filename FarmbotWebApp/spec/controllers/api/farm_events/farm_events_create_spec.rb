require 'spec_helper'

describe Api::FarmEventsController do
  include Devise::Test::ControllerHelpers

  describe '#create' do
    let(:user) { FactoryBot.create(:user) }
    let(:sequence) { FakeSequence.create() }
    let(:regimen) { FactoryBot.create(:regimen, device: user.device) }

    it 'makes a farm_event' do
      sign_in user
      SmarfDoc.note("This is how you could create a FarmEvent that fires " +
                    "every 4 minutes.")
      input = { executable_id: sequence.id,
                executable_type: sequence.class.name,
                start_time: (Time.now + 1.minute).as_json,
                end_time: '2029-02-17T18:19:20.000Z',
                repeat: 4,
                time_unit: 'minutely' }
      before = FarmEvent.count
      post :create, params: input
      expect(response.status).to eq(200)
      expect(before < FarmEvent.count).to be_truthy
    end

    it 'handles missing farm_event id' do
      sign_in user
      input = { start_time: '2025-02-17T15:16:17.000Z',
                end_time: '2029-02-17T18:19:20.000Z',
                repeat: 4,
                time_unit: 'minutely' }
      post :create, params: input
      expect(response.status).to eq(422)
      expect(json.keys).to include(:farm_event)
    end

    it 'creates a one-off FarmEvent' do
      sign_in user
      r = FactoryBot.create(:regimen, device: user.device)
      input = { "start_time": (Time.now + 1.hour).to_json.gsub("\"", ""),
                "next_time": "2017-06-05T18:33:04.342Z",
                "time_unit": "never",
                "executable_id": r.id,
                "executable_type": "Regimen",
                "end_time": "2017-06-05T18:34:00.000Z",
                "repeat": 1 }
      post :create, params: input
      expect(response.status).to eq(200)
      get :index
      expect(json.length).to eq(1)
    end

    it 'disallows FarmEvents too far in the past' do
      sign_in user
      r = FactoryBot.create(:regimen, device: user.device)
      input = { "start_time": (Time.now - 40.years).as_json,
                "time_unit": "never",
                "executable_id": r.id,
                "executable_type": "Regimen",
                "end_time": "2017-06-05T18:34:00.000Z",
                "repeat": 1 }
      post :create, params: input
      expect(response.status).to eq(422)
      expect(json[:start_time]).to include("too far in the past")
    end

    it 'disallows FarmEvents too far in the future' do
      sign_in user
      r = FactoryBot.create(:regimen, device: user.device)
      input = { "end_time": "+099999-08-18T13:54:00.000Z",
                "time_unit": "never",
                "executable_id": r.id,
                "executable_type": "Regimen",
                "repeat": 1 }
      post :create, params: input
      expect(response.status).to eq(422)
      expect(json[:end_time]).to include("too far in the future")
    end
  end
end
