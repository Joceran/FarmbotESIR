# If a Regimen is an ordered checklist of sequences that must be executed,
# the RegimenItem represents one item on the todo list.
# This is a join table. a Regimen can have many sequences. A sequence
# can be used in many regimens. RegimenItem links a sequence and regimen.
class RegimenItem < ApplicationRecord
  belongs_to :regimen
  belongs_to :sequence
  validates :sequence, presence: true

  def broadcast?
    false
  end
end
