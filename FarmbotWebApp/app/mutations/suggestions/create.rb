module Suggestions
  class Create < Mutations::Command
    required do
      integer :listSuggestion_id
      string :plantId
      string :plantSlug
      integer :quantity
      string :becauseOf
    end

    def execute
      Suggestion.create!(inputs)
    end
  end
end
