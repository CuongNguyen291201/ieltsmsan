import { Grid, Theme, useMediaQuery } from '@mui/material';
import { _Category } from '../../custom-types';
import CourseItem from "../CourseItem";
import './style.scss';

const HomeCategorySection = (props: { categories?: _Category[] }) => {
  const { categories = [] } = props;
  const isDownLg = useMediaQuery((theme: Theme) => theme.breakpoints.down('lg'));
  const isDownSm = useMediaQuery((theme: Theme) => theme.breakpoints.down('sm'));

  return (
    <div className="section-main" style={{ paddingTop: "100px" }}>
      <div className="container category-list">
        <Grid container spacing={4}>
          {categories[0]?.courses.map((c, i) => {
            const popupPlacement = isDownSm ? "center" : (isDownLg 
            ? (i % 2 === 1 ? "left" : "right") 
            : (i % 3 === 2 ? "left" : "right"));
            return (<Grid key={c._id} item xs={12} sm={6} lg={4}>
              <CourseItem course={c} popupPlacement={popupPlacement} />
            </Grid>)
          })}
        </Grid>
      </div>
    </div>
  )
}

export default HomeCategorySection;