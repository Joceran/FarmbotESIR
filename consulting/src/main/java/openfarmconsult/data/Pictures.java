
package openfarmconsult.data;

import java.util.List;
import com.google.gson.annotations.Expose;
import com.google.gson.annotations.SerializedName;

public class Pictures {

    @SerializedName("links")
    @Expose
    private Links__ links;
    @SerializedName("data")
    @Expose
    private List<Datum_> data = null;

    /**
     * No args constructor for use in serialization
     * 
     */
    public Pictures() {
    }

    /**
     * 
     * @param data
     * @param links
     */
    public Pictures(Links__ links, List<Datum_> data) {
        super();
        this.links = links;
        this.data = data;
    }

    public Links__ getLinks() {
        return links;
    }

    public void setLinks(Links__ links) {
        this.links = links;
    }

    public List<Datum_> getData() {
        return data;
    }

    public void setData(List<Datum_> data) {
        this.data = data;
    }

}
