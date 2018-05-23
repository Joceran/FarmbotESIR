require "spec_helper"

describe Device do
  let(:device) { FactoryBot.create(:device, users: [FactoryBot.create(:user)]) }
  let(:user)   { device.users.first }

  it "is associated with a user" do
    expect(device.users.first).to be_kind_of(User)
    expect(user.device).to be_kind_of(Device)
  end

  it "destroys dependent devices" do
    bot_id  = device.id
    user_id = user.id
    user.destroy
    user_results = User.where(id: user_id).first
    bot_results  = Device.where(id: bot_id).first
    expect(bot_results).to be_nil
    expect(user_results).to be_nil
  end

  it "calculates TZ offset in hours" do
    device.timezone = nil
    expect(device.tz_offset_hrs).to be 0
    device.timezone = "America/Chicago"
    expect([-5, -6, -7]).to include device.tz_offset_hrs # Remember DST!
  end

  it "sends specific users toast messages" do
    Transport.current.clear!
    hello      = "Hello!"
    log        = device.tell(hello)
    json, info = Transport.current.connection.calls[:publish].last
    json       = JSON.parse(json)
    expect(info[:routing_key]).to eq("bot.device_#{device.id}.logs")
    expect(log.message).to eq(hello)
    expect(json["message"]).to eq(hello)
  end

  it "allows for caching" do
    id        = device.id
    cache_key = Device::CACHE_KEY % id
    Rails.cache.delete(cache_key)
    expect(Rails.cache.exist?(cache_key)).to be false
    expect(Rails.cache.fetch(cache_key)).to eq(nil)
    Device.cached_find(id)
    expect(Rails.cache.exist?(cache_key)).to be true
    expect(Rails.cache.fetch(cache_key)).to eq(device)
    Rails.cache.delete(cache_key)
  end

  it "refreshes the cache" do
    id        = device.id
    cache_key = Device::CACHE_KEY % id
    Rails.cache.delete(cache_key)
    b4        = device.name
    expect(Device.cached_find(id).name).to eq(b4)
    device.name = "blah"
    expect(Device.cached_find(id).name).to eq(b4)
    device.refresh_cache
    expect(Device.cached_find(id).name).to eq("blah")
  end

  it "throttles a device that sends too many logs" do
    expect(device).to receive(:tell)
    device.update_attributes!(throttled_until: nil)
    expect(device.throttled_until).to be(nil)
    example = Time.now + 1.minute
    device.maybe_throttle_until(example)
    expect(device.throttled_until).to eq(example)
  end

  it "unthrottles a runaway device" do
    expect(device).to receive(:tell)
    example = Time.now - 1.minute
    device.update_attributes!(throttled_until: example)
    expect(device.throttled_until).to eq(example)
    device.maybe_unthrottle
    expect(device.throttled_until).to eq(nil)
  end
end
