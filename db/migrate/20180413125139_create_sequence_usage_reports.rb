class CreateSequenceUsageReports < ActiveRecord::Migration[5.1]
  def change
    create_view :sequence_usage_reports
  end
end
