//Functions
import { getTranslatedCategories } from '../../CategoriesImages/Categories';

//i18n
import { getLangFromUrl, useTranslations } from '../../i18n/utils';

//CSSFiles
import './CategoriesPicturesGallery.css';

function CategoriesPicturesGallery({url}) {
    const lang = getLangFromUrl(url);
    const t = useTranslations(lang);
    
    const CategoriesPictures = getTranslatedCategories(t);

    return (
        <div className="display-vertical">
            {
                CategoriesPictures.map((category, index) => (
                    <div key={index} className="display-horizontal custom-max-width">
                        {category.number%2 !== 0 ? (
                            <>
                                <img className="category-image" src={category.image} alt={category.alt} />
                                <div>
                                    <h3 className="medium-title light-color">{category.name}</h3>
                                    <p className="text">{category.description}</p>
                                </div>
                            </>
                        ) : (
                            <>
                                <div>
                                    <h3 className="medium-title light-color">{category.name}</h3>
                                    <p className="text">{category.description}</p>
                                </div>
                                <img className="category-image" src={category.image} alt={category.alt} />
                            </>
                        )}
                    </div>
                ))
            }
        </div>       
    )
}

export default CategoriesPicturesGallery;