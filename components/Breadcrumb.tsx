import { ArrowRight } from "@mui/icons-material";
import Link from 'next/link';
import { Breadcrumbs as MuiBreadcrumbs, Container } from "@mui/material";
import { withStyles, makeStyles } from "@mui/styles";
import { memo, PropsWithoutRef, useMemo } from 'react';
import classNames from 'classnames';
import { useRouter } from "next/router";

type BreadcrumbItem = {
  name: string;
  slug?: string;
}

const useBreadcrumbStyles = makeStyles((_) => ({
  item: {
    fontWeight: 600,
    textDecoration: "none",
    "&:hover": {
      textDecoration: "underline"
    }
  },
  itemLight: {
    color: "#000"
  },
  itemDark: {
    color: "#1E2959"
  },
  lastItemLight: {
    color: "#1E2959"
  },
  lastItemDark: {
    color: "#fff"
  },
}));

const Breadcrumb = (props: PropsWithoutRef<{ items: Array<BreadcrumbItem>, invertColor?: boolean; }>) => {
  const { invertColor } = props;
  const classes = useBreadcrumbStyles();
  const router = useRouter();
  const items: Array<BreadcrumbItem> = useMemo(() => {
    return [
      { name: "Trang chủ", slug: process.env.NEXT_PUBLIC_HOMEPAGE || '/' },
      ...props.items
    ]
  }, [props.items]);

  const _Breadcrumbs = withStyles({
    separator: {
      margin: 0
    }
  })(MuiBreadcrumbs);

  return (
    <div style={{ backgroundColor: "#EBF0FC" }}>
      <Container maxWidth="xxl">
        <_Breadcrumbs className={invertColor ? classes.itemDark : classes.itemLight} separator={<ArrowRight color="inherit" />}>
          {items.map((item, i) => {
            const isEnd = i === items.length - 1;
            return (
              <Link key={i} href={isEnd ? (item.slug ?? router.asPath) : (item.slug ?? '#')}>
                <a className={classNames(classes.item, invertColor ? (isEnd ? classes.lastItemDark : classes.itemDark) : (isEnd ? classes.lastItemLight : classes.itemLight))}>
                  {item.name}
                </a>
              </Link>
            )
          })}
        </_Breadcrumbs>
      </Container>
    </div>
  )

}

export default memo(Breadcrumb);