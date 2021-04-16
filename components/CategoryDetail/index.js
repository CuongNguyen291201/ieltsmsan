import React from 'react'

function CategoryDetail({ childCategories }) {
  return (
    <div className="child-categories-list">
      {childCategories.map((el, index) => {
        return (
          <div className="child-categories-list-item">
            {el.name}
          </div>
        )
      })}
    </div>
  )
}

export default CategoryDetail
