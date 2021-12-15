import { Grid } from '@mui/material';
import { _Category } from '../../custom-types';
import CourseItem from "../CourseItem";
import './style.scss';

const HomeCategorySection = (props: { categories?: _Category[] }) => {
  const { categories = [] } = props;

  return (
    <div className="section-main" style={{ paddingTop: "100px" }}>
      <div className="container category-list">
        <Grid container spacing={4} justifyContent="center">
          {categories[0]?.courses.map((c) => {
            return (<Grid key={c._id} item xs={12} sm={6} md={4}>
              <CourseItem course={c} />
            </Grid>)
          })}
        </Grid>
      </div>
    </div>
  )
}

export default HomeCategorySection;