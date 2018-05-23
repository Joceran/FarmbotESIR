package openfarmconsult.consulting;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.net.HttpURLConnection;
import java.net.MalformedURLException;
import java.net.URL;
import java.net.URLConnection;
import java.net.URLEncoder;
import java.nio.charset.Charset;
import java.nio.file.Files;
import java.util.Scanner;
import java.util.stream.Collectors;

import javax.swing.plaf.basic.BasicInternalFrameTitlePane.IconifyAction;

import com.fasterxml.jackson.core.JsonParseException;
import com.fasterxml.jackson.databind.JsonMappingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.util.JSONPObject;
import com.github.jasminb.jsonapi.JSONAPIDocument;
import com.github.jasminb.jsonapi.retrofit.JSONAPIConverterFactory;
import com.google.gson.Gson;
import com.google.gson.JsonArray;
import com.google.gson.JsonElement;
import com.google.gson.JsonObject;
import com.google.gson.JsonParser;

import okhttp3.OkHttpClient;
import okhttp3.Request;
import okhttp3.Response;
import openfarmconsult.data.Crop;
import retrofit2.Retrofit;

public class Consulting {

	/**
	 * Get the data of a crop from its name
	 * @param name
	 * @return the data of the crop
	 * @throws IOException 
	 */
	public Crop getCropIdByName(final String name) throws IOException {
		Gson gson = new Gson();
		
		OkHttpClient client = new OkHttpClient();

		Request request = new Request.Builder()
		  .url("http://openfarm.cc/api/v1/crops/?filter="+URLEncoder.encode(name, "UTF-8"))
		  .get()
		  .addHeader("Cache-Control", "no-cache")
		  .build();

		Response response = client.newCall(request).execute();
		
		String json = response.body().string();
		
		JsonObject jsonObject = new JsonParser().parse(json).getAsJsonObject();
		JsonArray data = jsonObject.getAsJsonArray("data");
		//System.out.println(data.toString());
		
		//Recherche la bonne graine parmis toutes celles retournées
		for(JsonElement crop: data) {
			Crop c = gson.fromJson(crop, Crop.class);
			System.out.println("Recherche avec : "+c.getAttributes().getName());
			if(c.getAttributes().getName().equals(name)) {
				return getCropFromId(c.getId());
			}
		}
		return null;
	}
	
	/**
	 * Get data of a crop from its id.
	 * @param id : the id of the crop
	 * @return a Json String with data of the crop
	 * @throws MalformedURLException 
	 * @throws JsonMappingException 
	 * @throws JsonParseException 
	 * @throws IOException 
	 */
	public Crop getCropFromId(final String id) throws JsonParseException, JsonMappingException, MalformedURLException, IOException {
		Gson gson = new Gson();
		
		OkHttpClient client = new OkHttpClient();

		Request request = new Request.Builder()
		  .url("http://openfarm.cc/api/v1/crops/"+id)
		  .get()
		  .addHeader("Cache-Control", "no-cache")
		  .build();

		Response response = client.newCall(request).execute();

		String json = response.body().string();

		JsonObject jsonObject = new JsonParser().parse(json).getAsJsonObject();
		JsonElement data = jsonObject.get("data");
		//System.out.println(data.toString());
		Crop c = gson.fromJson(data, Crop.class);
		
		
		//System.out.println(c.getId() + " " + c.getAttributes().getSlug());
		
		return c;
	}
}
