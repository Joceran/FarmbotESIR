require "spec_helper"
require_relative "../../lib/log_service_support"

describe LogService do
  normal_payl  = '{"meta":{"z":0,"y":0,"x":0,"type":"info","major_version":6},' +
  '"message":"HQ FarmBot TEST 123 Pin 13 is 0","created_at":'+
  '1512585641,"channels":[]}'

  legacy_payl  = '{"meta":{"z":0,"y":0,"x":0,"type":"info"},' +
  '"message":"HQ FarmBot TEST 123 Pin 13 is 0","created_at":'+
  '1512585641,"channels":[]}'
  FakeDeliveryInfo   = Struct.new(:routing_key)
  device_id          = FactoryBot.create(:device).id
  fake_delivery_info = FakeDeliveryInfo.new("bot.device_#{device_id}.logs")

  class FakeLogChan
    attr_reader :subcribe_calls

    def initialize
      @subcribe_calls = 0
    end

    def subscribe(*)
      @subcribe_calls += 1
    end
  end

  it "clips overflowing logs" do
    device = Device.find(device_id)
    FactoryBot.create_list(:log, device.max_log_count + 10, device: device)
    b4 = device.logs.count
    LogService.process(fake_delivery_info, normal_payl)
    expect(device.logs.count).to be < b4
    expect(device.logs.count).to eq(device.max_log_count)
  end

  it "calls .subscribe() on Transport." do
    fakee = FakeLogChan.new
    allow(Transport).to receive(:log_channel) { fakee }
    expect(fakee.subcribe_calls).to eq(0)
    load "lib/log_service.rb"
    expect(fakee.subcribe_calls).to eq(1)
  end

  it "creates new messages in the DB when called" do
    Log.destroy_all
    b4 = Log.count
    LogService.process(fake_delivery_info, normal_payl)
    expect(Log.count).to be > b4
  end

  it "ignores legacy logs" do
    Log.destroy_all
    b4 = Log.count
    LogService.process(fake_delivery_info, legacy_payl)
    expect(b4).to eq(Log.count)
  end

  it "knows when to not save" do
    dont_save1 = { # `fun` type (easter eggs n stuff)
      "meta" => {
        "z"=>0,
        "y"=>0,
        "x"=>0,
        "type"=>"fun",
        "major_version"=>6
      },
      "message"=>"dont_save1",
      "created_at"=>1512585641,
      "channels"=>[]
    }

    dont_save2 = { # Missing `type`.
      "meta" => {
        "z"=>0,
        "y"=>0,
        "x"=>0,
        "major_version"=>6
      },
      "message"=>"dont_save2",
      "created_at"=>1512585641,
      "channels"=>[]
    }

    do_save = {
      "meta" => {
        "z"=>0,
        "y"=>0,
        "x"=>0,
        "type"=>"info",
        "major_version"=>6
      },
      "message"=>"dont_save",
      "created_at"=>1512585641,
      "channels"=>[]
    }
    expect(LogService.save?(dont_save1)).to be(false)
    expect(LogService.save?(dont_save2)).to be(false)
    expect(LogService.save?(do_save)).to be(true)
  end
end
