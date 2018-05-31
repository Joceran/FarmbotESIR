class CreateListSuggestion < ActiveRecord::Migration[5.1]
  def change
	drop_table :list_suggestions
    create_table :list_suggestions do |t|
		
		#Id of the user
		t.string :userId
		
		t.string :saison
		
		t.string :dateDemande
		
		t.string :luminosite
		
		t.string :changement
		
		t.boolean :fruits
		
		t.boolean :legumes
    end
  end
end
