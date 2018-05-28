class ListSuggestion < ActiveRecord::Migration[5.1]
  def change
	  create_table :listSuggestions, id: false do |t|

		  #Id of the user
		  t.string :userId
		  
		  #Id of the suggest
		  t.string :suggestId

  end
end
