
package openfarmconsult.data;

import com.google.gson.annotations.Expose;
import com.google.gson.annotations.SerializedName;

public class Links_ {

    @SerializedName("related")
    @Expose
    private String related;

    /**
     * No args constructor for use in serialization
     * 
     */
    public Links_() {
    }

    /**
     * 
     * @param related
     */
    public Links_(String related) {
        super();
        this.related = related;
    }

    public String getRelated() {
        return related;
    }

    public void setRelated(String related) {
        this.related = related;
    }

}
