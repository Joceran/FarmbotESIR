
package openfarmconsult.data;

import java.util.List;
import com.google.gson.annotations.Expose;
import com.google.gson.annotations.SerializedName;

public class Companions {

    @SerializedName("links")
    @Expose
    private Links_ links;
    @SerializedName("data")
    @Expose
    private List<Datum> data = null;

    /**
     * No args constructor for use in serialization
     * 
     */
    public Companions() {
    }

    /**
     * 
     * @param data
     * @param links
     */
    public Companions(Links_ links, List<Datum> data) {
        super();
        this.links = links;
        this.data = data;
    }

    public Links_ getLinks() {
        return links;
    }

    public void setLinks(Links_ links) {
        this.links = links;
    }

    public List<Datum> getData() {
        return data;
    }

    public void setData(List<Datum> data) {
        this.data = data;
    }

}
