import { Grid } from '@mui/material';
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
        Learning IELTS with Ms An
      </div>
      <div className="home-section-description">
      </div>

      <div className="section-main">
        <div className="container category-list">
          <Grid container spacing={3} justify="center">
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