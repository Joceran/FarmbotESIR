
package openfarmconsult.data;

import java.util.List;
import com.google.gson.annotations.Expose;
import com.google.gson.annotations.SerializedName;

public class Attributes {

    @SerializedName("name")
    @Expose
    private String name;
    @SerializedName("slug")
    @Expose
    private String slug;
    @SerializedName("binomial_name")
    @Expose
    private String binomialName;
    @SerializedName("common_names")
    @Expose
    private List<String> commonNames = null;
    @SerializedName("description")
    @Expose
    private String description;
    @SerializedName("sun_requirements")
    @Expose
    private String sunRequirements;
    @SerializedName("sowing_method")
    @Expose
    private String sowingMethod;
    @SerializedName("spread")
    @Expose
    private int spread;
    @SerializedName("row_spacing")
    @Expose
    private int rowSpacing;
    @SerializedName("height")
    @Expose
    private int height;
    @SerializedName("processing_pictures")
    @Expose
    private int processingPictures;
    @SerializedName("guides_count")
    @Expose
    private int guidesCount;
    @SerializedName("main_image_path")
    @Expose
    private String mainImagePath;
    @SerializedName("taxon")
    @Expose
    private String taxon;
    @SerializedName("tags_array")
    @Expose
    private List<Object> tagsArray = null;
    @SerializedName("growing_degree_days")
    @Expose
    private Object growingDegreeDays;
    @SerializedName("svg_icon")
    @Expose
    private String svgIcon;

    /**
     * No args constructor for use in serialization
     * 
     */
    public Attributes() {
    }

    /**
     * 
     * @param processingPictures
     * @param binomialName
     * @param guidesCount
     * @param sunRequirements
     * @param tagsArray
     * @param svgIcon
     * @param commonNames
     * @param rowSpacing
     * @param height
     * @param description
     * @param name
     * @param sowingMethod
     * @param mainImagePath
     * @param slug
     * @param spread
     * @param growingDegreeDays
     * @param taxon
     */
    public Attributes(String name, String slug, String binomialName, List<String> commonNames, String description, String sunRequirements, String sowingMethod, int spread, int rowSpacing, int height, int processingPictures, int guidesCount, String mainImagePath, String taxon, List<Object> tagsArray, Object growingDegreeDays, String svgIcon) {
        super();
        this.name = name;
        this.slug = slug;
        this.binomialName = binomialName;
        this.commonNames = commonNames;
        this.description = description;
        this.sunRequirements = sunRequirements;
        this.sowingMethod = sowingMethod;
        this.spread = spread;
        this.rowSpacing = rowSpacing;
        this.height = height;
        this.processingPictures = processingPictures;
        this.guidesCount = guidesCount;
        this.mainImagePath = mainImagePath;
        this.taxon = taxon;
        this.tagsArray = tagsArray;
        this.growingDegreeDays = growingDegreeDays;
        this.svgIcon = svgIcon;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getSlug() {
        return slug;
    }

    public void setSlug(String slug) {
        this.slug = slug;
    }

    public String getBinomialName() {
        return binomialName;
    }

    public void setBinomialName(String binomialName) {
        this.binomialName = binomialName;
    }

    public List<String> getCommonNames() {
        return commonNames;
    }

    public void setCommonNames(List<String> commonNames) {
        this.commonNames = commonNames;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public String getSunRequirements() {
        return sunRequirements;
    }

    public void setSunRequirements(String sunRequirements) {
        this.sunRequirements = sunRequirements;
    }

    public String getSowingMethod() {
        return sowingMethod;
    }

    public void setSowingMethod(String sowingMethod) {
        this.sowingMethod = sowingMethod;
    }

    public int getSpread() {
        return spread;
    }

    public void setSpread(int spread) {
        this.spread = spread;
    }

    public int getRowSpacing() {
        return rowSpacing;
    }

    public void setRowSpacing(int rowSpacing) {
        this.rowSpacing = rowSpacing;
    }

    public int getHeight() {
        return height;
    }

    public void setHeight(int height) {
        this.height = height;
    }

    public int getProcessingPictures() {
        return processingPictures;
    }

    public void setProcessingPictures(int processingPictures) {
        this.processingPictures = processingPictures;
    }

    public int getGuidesCount() {
        return guidesCount;
    }

    public void setGuidesCount(int guidesCount) {
        this.guidesCount = guidesCount;
    }

    public String getMainImagePath() {
        return mainImagePath;
    }

    public void setMainImagePath(String mainImagePath) {
        this.mainImagePath = mainImagePath;
    }

    public String getTaxon() {
        return taxon;
    }

    public void setTaxon(String taxon) {
        this.taxon = taxon;
    }

    public List<Object> getTagsArray() {
        return tagsArray;
    }

    public void setTagsArray(List<Object> tagsArray) {
        this.tagsArray = tagsArray;
    }

    public Object getGrowingDegreeDays() {
        return growingDegreeDays;
    }

    public void setGrowingDegreeDays(Object growingDegreeDays) {
        this.growingDegreeDays = growingDegreeDays;
    }

    public String getSvgIcon() {
        return svgIcon;
    }

    public void setSvgIcon(String svgIcon) {
        this.svgIcon = svgIcon;
    }

}
