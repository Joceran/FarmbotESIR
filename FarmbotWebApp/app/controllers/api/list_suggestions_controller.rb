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
	
	#GET /api/list_suggestion_byuser
	def getByUser
		lists = ListSuggestion.where(userId: params.as_json["id"]).order("id DESC");
		json = "{ \"entries\":[";
		lists.all.each do |list|
		  json = json+"{";
		  json = json+"\"id\" : \"" + list.id.to_s + "\", \"userId\" : \""+list.userId+"\", \"saison\" : \""+list.saison+"\", \"luminosite\" : \""+list.luminosite+"\", \"changement\" : \""+list.changement+"\", \"fruits\" : \""+list.fruits.to_s+"\", \"legumes\" : \""+list.legumes.to_s+"\", \"dateDemande\" : \""+list.dateDemande.to_s+"\"";
		  json = json+"},";
		end
		json = json.chomp(",")+"]}";
		render json: json;
	end
	
	#POST /api/list_suggestion
    def create
		#puts params.as_json;
		fruits = false;
		legumes = false;
		if (params["fruits"] == "true")
			fruits = true;
		end
		if (params["legumes"] == "true")
			legumes = true;
		end
		
		@listId = mutate ListSuggestions::Create.run(userId: params["userId"], dateDemande: Date.today.to_s, luminosite: params["luminosite"], saison: params["saison"], fruits: fruits, legumes: legumes, changement: params["changement"])
		
		#Creer des suggestions en fonctions de l'algo
		@plants = Plant.all
		@plantList = {"apple-tree" => {sun: "Fort", type: "fruit"} , "strawberry" => {sun: "Fort", type: "fruit"}, "melon" => {sun: "Fort", type: "fruit"}, "potato" => {sun: "Fort", type: "legume"}, "lettuce" => {sun: "Modéré", type: "legume"}, "eggplant" => {sun: "Fort", type: "legume"} }
		@user_id = params["userId"]																
		
		#si on veut changer les habitudes ou aucune plante sur laquelle baser notre recommandation
		if (params["changement"] == "any" or params["changement"] == "oui" or @plants.empty?)
			if ((fruits and legumes) or (not fruits and not legumes))
				@plantList.each do |nom, attribut|
					if(attribut[:sun] == params["luminosite"])
						suggestedCrop = getCropFromName(nom)
						if (suggestedCrop.attributes.spread.nil? or suggestedCrop.attributes.spread==0)
							quantity = 1
						else
							quantity = (60/suggestedCrop.attributes.spread.to_f).ceil
						end
						
						newEntry = Suggestion.new
						newEntry.plantId = suggestedCrop.id
						newEntry.plantSlug = suggestedCrop.attributes.slug
						newEntry.becauseOf = nom
						newEntry.listSuggestion_id = @listId
						newEntry.quantity = quantity
						
						newEntry.save
					end
				end
			elsif (fruits and not legumes)
				@plantList.each do |nom, attribut|
					if(attribut[:sun] == params["luminosite"]) && (attribut[:type] == "fruit")
						suggestedCrop = getCropFromName(nom)
						
						newEntry = Suggestion.new
						newEntry.plantId = suggestedCrop.id
						newEntry.plantSlug = suggestedCrop.attributes.slug
						newEntry.becauseOf = nom
						newEntry.listSuggestion_id = @listId
						newEntry.quantity = quantity
						
						newEntry.save
					end
				end
			elsif (not fruits and legumes)
				@plantList.each do |nom, attribut|
					if(attribut[:sun] == params["luminosite"]) && (attribut[:type] == "fruit")
						suggestedCrop = getCropFromName(nom)
						
						newEntry = Suggestion.new
						newEntry.plantId = suggestedCrop.id
						newEntry.plantSlug = suggestedCrop.attributes.slug
						newEntry.becauseOf = nom
						newEntry.listSuggestion_id = @listId
						newEntry.quantity = quantity
						
						newEntry.save
					end
				end
			end
		else
			recommandations(params["luminosite"])
		end
	end
	
	def recommandations(lightning)
		if lightning=="Fort" 
			lightning="Full Sun"
		end
		if lightning=="Modéré"
			lightning="Partial Sun"
		end
		if lightning=="Faible"
			lightning=="Partial Sun"
		end
		
		suggList = Array[]
		
		@plants.each do |crop|
			#on ne prend pas en considération plusieurs fois la même plante
			if not suggList.include? crop.openfarm_slug
				#on se limite à 10 suggestions
				if suggList.length < 10
					suggList.push(crop.openfarm_slug)
					
					cropTemp = getCropFromName(crop.openfarm_slug)
					crop_companions_data = cropTemp.relationships.companions.data
					
					crop_companions_data.each do |datum|
						suggestedCrop = getCropFromId(datum.id)
						
						if((lightning != "any" and suggestedCrop.data.attributes.sun_requirements == lightning) or lightning == "any")
							if (suggestedCrop.data.attributes.spread.nil? or suggestedCrop.data.attributes.spread==0)
								quantity = 1
							else
								quantity = (60/suggestedCrop.data.attributes.spread.to_f).ceil
							end
							suggList.push(suggestedCrop.data.attributes.slug)
							
							newEntry = Suggestion.new
							newEntry.plantId = suggestedCrop.data.id
							newEntry.plantSlug = suggestedCrop.data.attributes.slug
							newEntry.becauseOf = crop.openfarm_slug
							newEntry.listSuggestion_id = @listId
							newEntry.quantity = quantity
							
							newEntry.save
						end
					end
				end
			end
		end
	end


	def getCropFromName(name)
		encoded_name = URI::encode(name)
		url = "http://openfarm.cc/api/v1/crops/#{encoded_name}"
		response = HTTParty.get(url)
		
		json_string = response.body
		data = JSON.parse(json_string, object_class: OpenStruct)['data']
		
		return data
	end

	def getCropFromId(id)
		url = "http://openfarm.cc/api/v1/crops/#{id}"
		response = HTTParty.get(url)
		
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
end
