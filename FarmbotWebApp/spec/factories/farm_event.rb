FactoryBot.define do
  factory :farm_event do
    start_time { Date.yesterday - [*(1..5)].sample.days }
    end_time   { Date.today + 1.minute + ([*(1..5)].sample).days }
    time_unit  { FarmEvent::UNITS_OF_TIME.sample }
    repeat { [*(1..5)].sample }
    # device
    after(:build) do |s|
      s.executable ||= FakeSequence.create(device: s.device)
      s.device ||= s.executable.try(:device)
    end
  end
end
