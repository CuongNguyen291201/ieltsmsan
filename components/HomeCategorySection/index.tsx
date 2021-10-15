import { Grid } from '@material-ui/core';
import { _Category } from '../../custom-types';
import CategoryItem from '../CategoryItem';
import SectionLabel from '../SectionLabel';
import './style.scss';

const HomeCategorySection = (props: { categories?: _Category[] }) => {
  const { categories = [] } = props;

  return (
    <div className="main-category-section">
      <SectionLabel></SectionLabel>
      <div className="home-section-title">
        ĐA DẠNG CÁC TRƯỜNG
      </div>
      <div className="home-section-description">
        Đa dạng các trường cho bạn lựa chọn. Giúp việc học trở lên dễ dàng hơn
      </div>

      <div className="section-main">
        <div className="container">
          <Grid container spacing={3}>
            {categories.map((e, i) => (
              <Grid key={i} item xs={12} sm={6} md={3}>
                <CategoryItem category={e} />
              </Grid>
            ))}
          </Grid>
        </div>
      </div>

    </div>
  )
}

export default HomeCategorySection;