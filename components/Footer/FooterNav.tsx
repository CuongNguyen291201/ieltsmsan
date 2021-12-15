import { FacebookRounded } from "@mui/icons-material"
import { Box, Grid, Link, Typography } from "@mui/material"
import { withStyles } from "@mui/styles"
import { Fragment } from 'react'
import WebSocial from "../../sub_modules/share/model/webSocial"
import FooterNavItem, { FooterNavItemProps } from './FooterNavItem'

const FooterNav = (props: { webSocial?: WebSocial }) => {
  const { webSocial } = props;
  // TODO: Hot utils
  const utils1: FooterNavItemProps[] = [
    { title: 'Học thử và làm bài test đầu vào', slug: '/' },
    { title: 'IELTS Online Tests', slug: '/' },
    { title: 'Khoá học tiếng anh online miễn phí cho người mất gốc', slug: '/' }
  ]

  const utils2: FooterNavItemProps[] = [
    { title: 'Khoá học IELTS cấp tốc', slug: '/' },
    { title: 'Khóa học IELTS 5.5 Online', slug: '/' },
    { title: 'Khóa học IELTS 6.5-8.0 Online', slug: '/' }
  ];

  const ItemLabel = withStyles({
    root: {
      color: "#fff",
      textAlign: "center"
    }
  })(Typography);

  return (
    <div className="footer-nav">
      <Grid container columnSpacing={5}>
        <Grid item id="utils" xs={6}>
          {utils1.map((e, i) => (
            <Fragment key={i}>
              <FooterNavItem title={e.title} slug={e.slug} />
            </Fragment>
          ))}
        </Grid>

        <Grid item id="policies" xs={6}>
          {utils2.map((e, i) => (
            <Fragment key={i}>
              <FooterNavItem title={e.title} slug={e.slug} />
            </Fragment>
          ))}
        </Grid>
      </Grid>

      <Grid container spacing={5}>
        <Grid item xs={4}>
          <ItemLabel>MAP</ItemLabel>
        </Grid>
        <Grid item xs={4}>
          <ItemLabel>DMCA</ItemLabel>
        </Grid>
        <Grid item xs={4}>
          <ItemLabel>SOCIAL</ItemLabel>
          <Box>
            <Link href={webSocial?.fanPage || "#"} rel="nofollow noopener" target="_blank">
              <FacebookRounded sx={{ color: "#1778F2" }} />
            </Link>
          </Box>
        </Grid>
      </Grid>
    </div>
  )
}

export default FooterNav;