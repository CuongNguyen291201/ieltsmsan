import { GetServerSideProps } from 'next';
import React from 'react';
import Layout from '../../components/Layout';
import MainHeader from '../../components/MainHeader';
import MainMenu from '../../components/MainMenu';
import RootCategoryDetail from '../../components/RootCategoryDetail';
import { OtsvCategory } from '../../custom-types';
import { wrapper } from '../../redux/store';
import { response_status } from '../../sub_modules/share/api_services/http_status';
import { CATEGORY_DETAIL_PAGE_TYPE } from '../../sub_modules/share/constraint';
import { apiGetCategoriesByParent, apiGetCategoryById } from '../../utils/apis/categoryApi';

type SlugTypes = {
  slug: string;
  type: number;
  id: string;
  category?: OtsvCategory;
  childCategories?: OtsvCategory[];
}

const DEFAULT_PAGE_TYPE = -1;

const Slug = (props: SlugTypes) => {
  const { id, slug, type = DEFAULT_PAGE_TYPE } = props;
  const mapTypePage = {
    [CATEGORY_DETAIL_PAGE_TYPE]: <RootCategoryDetail category={props.category} childCategories={props.childCategories} />,
    [DEFAULT_PAGE_TYPE]: <div>404</div>
  }
  return (
    <Layout>
      <MainHeader />
      <MainMenu />
      {mapTypePage[type ?? DEFAULT_PAGE_TYPE]}
    </Layout>
  )
}

export const getServerSideProps: GetServerSideProps = wrapper.getServerSideProps(async ({ store, query, req }) => {
  const items = (query.slug as string).split('-');
  const [id] = items.slice(-1);
  const type = Number(...items.slice(-2, -1));
  const slug = items.slice(0, -2).join('-');
  if (!id || !slug) return;
  try {
    if (type === CATEGORY_DETAIL_PAGE_TYPE) {
      let category: OtsvCategory = null;
      let childCategories: OtsvCategory[] = [];
      const [categoryRes, childCategoriesRes] = await Promise.all([apiGetCategoryById(id), apiGetCategoriesByParent(id)]);
      if (categoryRes.status === response_status.success && childCategoriesRes.status === response_status.success) {
        category = categoryRes.data;
        childCategories = childCategoriesRes.data;
      }
      return {
        props: {
          id, type, slug, category: categoryRes.data, childCategories: childCategoriesRes.data
        }
      }
    }
    return;
  } catch (_) {
    console.log('Internal Server Error');
    return;
  }
});

export default Slug;
