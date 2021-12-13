import { Grid, Card, CardMedia, CardContent, Typography, Rating, Box, Link } from '@mui/material';
import { _Category } from '../../custom-types';
import { numberFormat } from '../../utils';
import CategoryItem from '../CategoryItem';
import SectionLabel from '../SectionLabel';
import './style.scss';

const HomeCategorySection = (props: { categories?: _Category[] }) => {
  const { categories = [] } = props;

  return (
    <div className="section-main" style={{ paddingTop: "100px" }}>
      <div className="container category-list">
        <Grid container spacing={2} justifyContent="center">
          {categories[0]?.courses.map((c, index) => {
            return (
              <Grid key={index} item xs={12} sm={6} md={4}>
                <Link href={`/ielts-online/${c.slug}`} sx={{ textDecoration: "none" }}>
                  <Card sx={{ boxShadow: "0px 4px 30px rgba(95, 73, 118, 0.1)" }}>
                    <CardMedia sx={{ padding: "16px" }} component="img" image="https://storage.googleapis.com/ielts-fighters.appspot.com/elearning-react/2021/10/30/54040744ielts_writing_image" />
                    <CardContent>
                      <Typography
                        sx={{
                          fontSize: { lg: "20px", md: "16px", xs: "16px" }, maxHeight: "60px", padding: "10px 0", fontWeight: 500, color: "#000000"
                        }}
                        variant='subtitle1'
                      >{c.name}</Typography>
                      <Typography
                        sx={{
                          maxHeight: "50px", fontSize: { lg: "14px", md: "12px" }, padding: "10px 0", color: "#666666"
                        }} variant="inherit">{c.shortDesc.length > 0 ? c.shortDesc : "Học căn bản về ngữ pháp và từ vựng | 90 bài học"}</Typography>
                      <Box component="div" display="flex" alignItems="center" justifyContent="center" py={2}>
                        <Typography sx={{ flex: 0.3, color: "#F0452D", fontSize: { lg: "18px", md: "14px" }, fontWeight: "bold" }}>4.6</Typography>
                        <Rating sx={{ flex: 1 }} name="size-small" size="small" defaultValue={4.6} precision={0.1} readOnly />
                        <Typography
                          sx={{
                            flex: 1, fontSize: { lg: "16px", md: "12px", sm: "12px", xs: "12px" }
                          }}>{index % 2 === 0 ? "(999+ lượt học thử)" : "(999+ học viên)"}</Typography>
                      </Box>
                      <Typography sx={{ fontSize: "18px", fontWeight: 900, color: "#19CE7A" }} variant='body1'>{c.cost - c.discountPrice === 0 ? "MIỄN PHÍ" : numberFormat.format(c.cost - c.discountPrice) + " VNĐ"}</Typography>
                    </CardContent>
                  </Card>
                </Link>
              </Grid>
            )
          })}
        </Grid>
      </div>
    </div>
  )
}

export default HomeCategorySection;