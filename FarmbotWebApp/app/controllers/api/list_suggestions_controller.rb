module Api
  class ListSuggestionsController < Api::AbstractController
	#GET /api/list_suggestion
	def index
		allListSuggestions = ListSuggestion.all;
		#affiche dans la console les listes de suggestions
		puts allListSuggestions;
		allListSuggestions.all.each do |sugg|
		  puts "Id : " + sugg.id.to_s + "; User id : "+sugg.userId;
		end
	end
	
	#POST /api/list_suggestion
    def create
      puts params.as_json;
      puts params["userId"];
      mutate ListSuggestions::Create.run(userId: params["userId"])
      
      #Creer des suggestions en fonctions de l'algo
      #mutate Suggestions::Create.run(data: "tomate")
    end
  end
end
