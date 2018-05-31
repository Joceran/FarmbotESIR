module ListSuggestions
  class Create < Mutations::Command 
    required do
		string :userId
		string :saison
		string :dateDemande
		string :luminosite
		string :changement
		boolean :fruits
		boolean :legumes
    end

    def execute
		list = ListSuggestion.create!(inputs)
		return list.id
    end
  end
end
