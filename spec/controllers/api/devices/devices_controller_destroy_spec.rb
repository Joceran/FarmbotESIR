require 'spec_helper'

describe Api::DevicesController do
  include Devise::Test::ControllerHelpers


  describe '#destroy' do

    let(:user) { FactoryBot.create(:user) }

    it 'destroys a Device' do
      sign_in user
      old_bot = user.device
      delete :destroy, params: { id: user.device.id }
      user.reload
      expect(user.device.id).not_to eq(old_bot.id)
      expect(response.status).to eq(204)
    end
  end
end
