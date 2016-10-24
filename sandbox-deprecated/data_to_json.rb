require 'csv'
require 'json'

puts "Please supply the name of the file"

file_name = gets.strip
csv_file_name = "#{file_name}.csv"

csv = CSV.read(csv_file_name, headers: true)
headers = csv.headers

p headers

puts "Please select the number corresponding to the agency:"
headers.each_with_index { |header, index| puts "#{index}: #{header}"}

agency = gets

puts "Please select the number corresponding to the account:"
headers.each_with_index { |header, index| puts "#{index}: #{header}"}

account = gets

puts "Please select the number corresponding to the fund:"
headers.each_with_index { |header, index| puts "#{index}: #{header}"}

fund = gets

puts "Please select the number corresponding to the operating unit:"
headers.each_with_index { |header, index| puts "#{index}: #{header}"}

operating_unit = gets

puts "Please select the number corresponding to the operating lob:"
headers.each_with_index { |header, index| puts "#{index}: #{header}"}

lob = gets

puts "Please select the number corresponding to the program name:"
headers.each_with_index { |header, index| puts "#{index}: #{header}"}

program_name = gets

puts "Please select the number corresponding to the amount:"
headers.each_with_index { |header, index| puts "#{index}: #{header}"}

amount = gets

data = []
stuff = []
csv.each do |row|
  data << {
    agency: row[headers[agency.to_i]], #row["Account Description"],
    #account: row[headers[account.to_i]], #row["Account Description"],
    fund: row[headers[fund.to_i]], #row["FundDescription"],
    #unit: row[headers[operating_unit.to_i]],  #row["OperatingUnitDescription"],
    lob: row[headers[lob.to_i]],  #row["OperatingUnitDescription"],
    program: row[headers[program_name.to_i]],  #row["OperatingUnitDescription"],
    key: row[headers[account.to_i]], #row["ProgramName"],
    value: row[headers[amount.to_i]] #row["Budget"].to_i
  }
end

file = File.new("#{file_name}.json" , 'w')
file.write JSON.pretty_generate(data)
