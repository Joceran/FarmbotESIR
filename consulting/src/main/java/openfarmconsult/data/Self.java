
package openfarmconsult.data;

import com.google.gson.annotations.Expose;
import com.google.gson.annotations.SerializedName;

public class Self {

    @SerializedName("api")
    @Expose
    private String api;
    @SerializedName("website")
    @Expose
    private String website;

    /**
     * No args constructor for use in serialization
     * 
     */
    public Self() {
    }

    /**
     * 
     * @param website
     * @param api
     */
    public Self(String api, String website) {
        super();
        this.api = api;
        this.website = website;
    }

    public String getApi() {
        return api;
    }

    public void setApi(String api) {
        this.api = api;
    }

    public String getWebsite() {
        return website;
    }

    public void setWebsite(String website) {
        this.website = website;
    }

}
