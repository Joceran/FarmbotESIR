module ListSuggestions
  class Create < Mutations::Command
    required do
      string  :userId
    end

    def execute
      ListSuggestion.create!(inputs)
    end
  end
end
