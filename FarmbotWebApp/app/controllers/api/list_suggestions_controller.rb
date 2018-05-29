module Api
  class ListSuggestionsController < Api::AbstractController
	#GET /api/list_suggestion
	def index
		@plants = Plants.all
		allListSuggestions = ListSuggestion.all;
		#affiche dans la console les listes de suggestions
		puts allListSuggestions;
		allListSuggestions.all.each do |sugg|
		  puts "Id : " + sugg.id.to_s + "; User id : "+sugg.userId;
		end
		end
		
		#POST /api/list_suggestion
		def create
		  @plants = Plants.all
		  
		  @plantList = {"apple" => {sun: "Fort", type: "fruit"} , "strawberry" => {sun: "Fort", type: "fruit"}, "melon" => {sun: "Fort", type: "fruit"}, "potato" => {sun: "Fort", type: "legume"}, "lettuce" => {sun: "Modéré", type: "legume"}, "eggplant" => {sun: "Fort", type: "legume"} }
																			
		  puts params.as_json;
		  puts params["userId"];																																				
      @user_id = params["userId"]																
      newListSuggestion = mutate ListSuggestions::Create.run(userId: params["userId"], dateDemande: Date.today, luminosite: params["eclairage"])
      
			if @plants.find(:all).empty?
				if (params["fruit"] == true) && (params["legume"] == true)
					for @plantList.each do |nom, attribut|
						if(attribut.sun == params["luminosite"]
							newEntry = Suggestions.newEntry
							suggestedCrop = getCropFromName(nom)
							newEntry.plantId = suggestedCrop.data.id
							newEntry.plantSlug = suggestedCrop.data.attributes.slug
							newEntry.becauseOf = crop.openfarm_slug
							newEntry.suggestId = newListSuggestion.id
						end
					end
				elsif (params["fruit"] == true) && (params["legume"] == false)
					for @plantList.each do |nom, attribut|
						if(attribut.sun == params["luminosite"]) && (attribut.type == "fruit")
							newEntry = Suggestions.newEntry
							suggestedCrop = getCropFromName(nom)
							newEntry.plantId = suggestedCrop.data.id
							newEntry.plantSlug = suggestedCrop.data.attributes.slug
							newEntry.becauseOf = crop.openfarm_slug
							newEntry.suggestId = newListSuggestion.id
						end
					end
				elsif (params["fruit"] == false) && (params["legume"] == true)
					for @plantList.each do |nom, attribut|
						if(attribut.sun == params["luminosite"]) && (attribut.type == "fruit")
							newEntry = Suggestions.newEntry
							suggestedCrop = getCropFromName(nom)
							newEntry.plantId = suggestedCrop.data.id
							newEntry.plantSlug = suggestedCrop.data.attributes.slug
							newEntry.becauseOf = crop.openfarm_slug
							newEntry.suggestId = newListSuggestion.id
						end
					end
				end
			else
				recommandations()
			end
				
      
      
      #Creer des suggestions en fonctions de l'algo
      #mutate Suggestions::Create.run(data: "tomate")
    end
	end
	
	#GET /api/get_recommandations
	def recommandations(lightning)
		puts "\n Voici vos recommandations"
		@plants.each do |crop|
				cropTemp = getCropFromName(crop.openfarm_slug)
				crop_companions_data = cropTemp.data.relationships.companions.data
				crop_companions_data.each do |datum|
						unless(@plants.include? getSlugFromId(datum.id))
								suggestedCrop = getCropFromName(getSlugFromId(datum.id))
								#if(suggestedCrop.data.attributes.sun_requirements == lightning)
									newEntry = Suggestions.newEntry
									newEntry.plantId = suggestedCrop.data.id
									newEntry.plantSlug = suggestedCrop.data.attributes.slug
									newEntry.becauseOf = crop.openfarm_slug
									newEntry.suggestId = newListSuggestion.id
									
									
									puts " - #{suggestedCrop.data.attributes.name}"
								#end
						end
				end
		end


		def getCropFromName(name)
      encoded_name = URI::encode(name)
      url = "http://openfarm.cc/api/v1/crops/?filter=#{encoded_name}"
      response = HTTParty.get(url)

      #puts response.body, response.code, response.message, response.headers.inspect

      crop = ''
      json_string = response.body
      datas = JSON.parse(json_string, object_class: OpenStruct)['data']
      datas.each do |data|
          if data.attributes.slug == name
              crop = getCropFromId(data.id)
          end
      end

      unless crop.nil?
          puts crop.data.attributes.slug
      end
  end

  def getCropFromId(id)
      url = "http://openfarm.cc/api/v1/crops/#{id}"
      response = HTTParty.get(url)

      #puts response.body, response.code, response.message, response.headers.inspect

      json_string = response.body
      json_object = JSON.parse(json_string, object_class: OpenStruct)
      
      return json_object
  end

  def getSlugFromId(id)
    url = "http://openfarm.cc/api/v1/crops/#{id}"
    response = HTTParty.get(url)

    #puts response.body, response.code, response.message, response.headers.inspect

    json_string = response.body
    json_object = JSON.parse(json_string, object_class: OpenStruct)
    
    return json_object.data.attributes.slug
	end
end
