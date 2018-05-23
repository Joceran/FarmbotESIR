package openfarmconsult.consulting;

import java.io.IOException;
import java.net.MalformedURLException;
import java.util.ArrayList;
import java.util.List;
import java.util.Scanner;

import javax.swing.plaf.synth.SynthSeparatorUI;

import com.fasterxml.jackson.core.JsonParseException;
import com.fasterxml.jackson.databind.JsonMappingException;
import com.google.gson.Gson;

import openfarmconsult.data.Companions;
import openfarmconsult.data.Crop;
import openfarmconsult.data.Datum;

/**
 * Hello world!
 *
 */
public class App 
{
	public static Scanner sc = new Scanner(System.in);
	public static List<Crop> cropList;
    public static void main( String[] args ) throws IOException
    {
        Consulting c = new Consulting();
        cropList = new ArrayList<Crop>();
        		
        boolean stop = false;
        int i = 0;
        while(!stop) {
        	System.out.println("Que faire ? \n 1. Rechercher et ajouter une plante ?\n 2. Avoir des recommandations.\n 3. Afficher la liste des plantes\n 4. Quitter");
        	i = sc.nextInt();
        	switch(i) {
        		case 1:
        			System.out.println("Quel légume voulez vous rechercher ?");
        			searchCrop(c, cropList);
        			break;
        		case 2:
        			if(cropList.isEmpty()) {
        				System.out.println("Votre collection est vide, ajouter un légume avant");
        			} else {
        				recommandations(c);
        			}
        			break;
        		case 3: 
        			System.out.println("Liste des plantes :");
        			list(cropList);
        			break;
        		case 4: 
        			System.out.println("Arrêt de programme");
        			stop = !stop;
        			break;
        		default:
        			System.out.println("Not a valid option");
        			break;
        	}
        
        }
        sc.close();
        
    }
    
    private static void list(List<Crop> cropList) {
		for(Crop c : cropList ) {
			System.out.println("- "+c.getAttributes().getName());
		}
	}

	public static void recommandations(Consulting c) throws JsonParseException, JsonMappingException, MalformedURLException, IOException {
		System.out.println("Voici vos recommandation : ");
    	for(Crop crop : cropList) {
            Companions comp = crop.getRelationships().getCompanions();
            for(Datum d: comp.getData()) {
            	if(!isInList(d.getId()))
            	{
            		System.out.println("- "+ c.getCropFromId(d.getId()).getAttributes().getName());
	
            	}
            }
    	}
		
	}
    
    public static boolean isInList(String id) {
		for(Crop c: cropList) {
			if(c.getId().equals(id)) {
				return true;
			}
		}
    	return false;
    	
    }
    

	public static void searchCrop(Consulting c, List<Crop> collect) throws JsonParseException, JsonMappingException, MalformedURLException, IOException {
		sc.nextLine();
		String name = sc.nextLine();
		
		Crop pp =c.getCropIdByName(name);
		
        System.out.println(pp.getAttributes().getName() + "\n" + pp.getAttributes().getDescription() 
        		+ "\n" + pp.getAttributes().getBinomialName());
        
        System.out.println("Near "+pp.getAttributes().getName() + " you can plant : ");
        Companions comp = pp.getRelationships().getCompanions();
        for(Datum d: comp.getData()) {
        	System.out.println("- "+ c.getCropFromId(d.getId()).getAttributes().getName());
        }
        System.out.println("Pour pousser il faut "+ pp.getAttributes().getSunRequirements());
        System.out.println("Ajouter à la collection ? y or n");
        

        String i = sc.nextLine();
        if(i.equals("y")) {
        	System.out.println("Ajouté");
        	collect.add(pp);
        } else {
        	System.out.println("Not added or you badly failed to press y, restart search to add to collect :) ");
        }
    }
}
