import React, { useEffect } from 'react'
import { getCategoriesByParentIdApi } from '../../api/categoryApi';
import CategoryDetail from '../../components/CategoryDetail';
import { wrapper } from '../../redux/store';
import { getUserFromToken } from '../../sub_modules/common/api/userApis';
import { loginSuccessAction } from '../../sub_modules/common/redux/actions/userActions';
import { CATEGORY_DETAIL_PAGE_TYPE } from '../../sub_modules/share/constraint';

function Slug({ slug, type, id, childCategories }) {

  switch (Number(type)) {

    case CATEGORY_DETAIL_PAGE_TYPE:
      return <CategoryDetail childCategories={childCategories} />;

    default:
      return <div>404</div>; // TODO: send 404 Page
  }
  // return (
  //   <div></div>
  // )
}

export const getServerSideProps = wrapper.getServerSideProps(async ({ store, query, req }) => {
  // const userInfo = await getUserFromToken(req);
  // if (userInfo) {
  //   store.dispatch(loginSuccessAction(userInfo));
  // }

  let items = query.slug.split('-')
  const { [items.length - 1]: id, [items.length - 2]: type, ...itemRest } = items;
  let slug = Object.values(itemRest).join('-')
  let childCategories = null

  if (type == CATEGORY_DETAIL_PAGE_TYPE) {
    try {
      const childCategoriesRes = await getCategoriesByParentIdApi(id)
      childCategories = childCategoriesRes.data.data
    } catch (error) {
      console.log('kkodfkdof');
      return {
        props: {
          type: null
        }
      }
    }
  }

  return {
    props: {
      slug,
      type,
      id,
      childCategories
    }
  }
});

export default Slug
