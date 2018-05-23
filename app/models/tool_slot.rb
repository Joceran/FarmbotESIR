# A single slot in a larger tool rack. Lets the sequence builder know things
# like where to put a tool when not in use, where to grab the next tool from,
# etc.
class ToolSlot < ApplicationRecord
  PULLOUT_DIRECTIONS = [NONE       = 0,
                        POSITIVE_X = 1,
                        NEGATIVE_X = 2,
                        POSITIVE_Y = 3,
                        NEGATIVE_Y = 4,]
  MAX_PULLOUT = PULLOUT_DIRECTIONS.max
  MIN_PULLOUT = PULLOUT_DIRECTIONS.min
  PULLOUT_ERR = "must be a value between #{MIN_PULLOUT} and #{MAX_PULLOUT}. "\
                "%{value} is not valid."
  IN_USE = "already in use by another tool slot"

  belongs_to :tool
  has_one :point, as: :pointer
  validates_uniqueness_of :tool,
    allow_blank: true,
    allow_nil: true,
    message: IN_USE
  validates  :pullout_direction,
    presence: true,
    inclusion: { in: PULLOUT_DIRECTIONS, message: PULLOUT_ERR }

  def broadcast?
    false
  end
end
