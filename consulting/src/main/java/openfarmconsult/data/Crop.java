
package openfarmconsult.data;

import com.google.gson.annotations.Expose;
import com.google.gson.annotations.SerializedName;

public class Crop {

    @SerializedName("id")
    @Expose
    private String id;
    @SerializedName("type")
    @Expose
    private String type;
    @SerializedName("attributes")
    @Expose
    private Attributes attributes;
    @SerializedName("links")
    @Expose
    private Links links;
    @SerializedName("relationships")
    @Expose
    private Relationships relationships;

    /**
     * No args constructor for use in serialization
     * 
     */
    public Crop() {
    }

    /**
     * 
     * @param id
     * @param links
     * @param attributes
     * @param type
     * @param relationships
     */
    public Crop(String id, String type, Attributes attributes, Links links, Relationships relationships) {
        super();
        this.id = id;
        this.type = type;
        this.attributes = attributes;
        this.links = links;
        this.relationships = relationships;
    }

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getType() {
        return type;
    }

    public void setType(String type) {
        this.type = type;
    }

    public Attributes getAttributes() {
        return attributes;
    }

    public void setAttributes(Attributes attributes) {
        this.attributes = attributes;
    }

    public Links getLinks() {
        return links;
    }

    public void setLinks(Links links) {
        this.links = links;
    }

    public Relationships getRelationships() {
        return relationships;
    }

    public void setRelationships(Relationships relationships) {
        this.relationships = relationships;
    }

}
