require 'rubygems'
require 'filewatcher'
require 'paint'

def clear
  print "\e[2J\e[f"
end

puts 'Update files to start tests.'

FileWatcher.new(["src/survey-invitations.js", "src-test/survey-invitations-test.js"]).watch(0.5) do |filename|
  clear
  ## %x[afplay ~/BEEP1.wav > /dev/null 2>&1 &]
  puts Paint['Start tests...', :yellow, :bright]
  testresult = %x[java -jar JsTestDriver.jar --tests all]
  if(testresult[/Fails: 0; Errors: 0/])
    puts testresult
    %x[afplay ~/munnharpe.wav > /dev/null 2>&1 &]
    puts Paint['Ok', :green, :bright]
  else
    puts testresult
    %x[afplay ~/R2D2a.wav > /dev/null 2>&1 &]
    puts Paint['Errors', :red, :bright]
  end
end
