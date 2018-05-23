
package openfarmconsult.data;

import com.google.gson.annotations.Expose;
import com.google.gson.annotations.SerializedName;

public class Relationships {

    @SerializedName("companions")
    @Expose
    private Companions companions;
    @SerializedName("pictures")
    @Expose
    private Pictures pictures;

    /**
     * No args constructor for use in serialization
     * 
     */
    public Relationships() {
    }

    /**
     * 
     * @param pictures
     * @param companions
     */
    public Relationships(Companions companions, Pictures pictures) {
        super();
        this.companions = companions;
        this.pictures = pictures;
    }

    public Companions getCompanions() {
        return companions;
    }

    public void setCompanions(Companions companions) {
        this.companions = companions;
    }

    public Pictures getPictures() {
        return pictures;
    }

    public void setPictures(Pictures pictures) {
        this.pictures = pictures;
    }

}
