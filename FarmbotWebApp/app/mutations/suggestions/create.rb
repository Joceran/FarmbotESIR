module Suggestions
  class Create < Mutations::Command
    required do
      string  :data
    end

    def execute
      Suggestion.create!(inputs)
    end
  end
end
