class CreateListSuggestion < ActiveRecord::Migration[5.1]
  def change
    create_table :list_suggestions do |t|
		
		#Id of the user
		t.string :userId
		
		#param 1 : ...
		
		#param 2 : ...
    end
  end
end
