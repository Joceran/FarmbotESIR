FactoryBot.define do
  factory :regimen, :class => 'Regimen' do
    name { Faker::Pokemon.name + Faker::Pokemon.name }
    device
  end
end
