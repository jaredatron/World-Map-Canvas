require 'rubygems'
require 'sinatra/base'
require 'csv'
require 'json'

class WorldMap < Sinatra::Base
  
  TOR_DATA = CSV.open('direct-users.csv','r').to_a.to_json

  set :public, File.dirname(__FILE__) + '/public'

  get '/' do
    haml :index
  end

  get '/index.css' do
    sass :index
  end

  get '/data.json' do
    content_type :json
    TOR_DATA
  end

end