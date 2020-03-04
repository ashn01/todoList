import { PURGE } from "redux-persist";
const SET_CATEGORIES = 'categories/SET_CATEGORIES';
const SET_TODOS = 'categories/SET_TODOS';
const SET_SELECTED_CATEGORY = 'categories/SET_SELECTED_CATEGORY';
// set todo after add/edit/delete and subscribe them in category, todo

export const setCategories = (categories) => ({ 
  type: SET_CATEGORIES,
    payload:{
      categories : categories
    }
});

export const setSelectedCategory = (selectedCategoryId, selectedCategoryIndex) =>({
  type: SET_SELECTED_CATEGORY,
    payload:{
      selectedCategoryId : selectedCategoryId,
      selectedCategoryIndex : selectedCategoryIndex
    }
})

export const setTodos = (todos) => ({
  type: SET_TODOS,
    payload:{
      todos : todos
    }
})

const initialState = {
  categories : [],
  selectedCategoryId : 0,
  selectedCategoryIndex : 0
}

export default function (state = initialState, action) {
    switch (action.type) {
      case SET_CATEGORIES:
        const {categories} = action.payload
        return {
          ...state,
          categories:categories
        };
      case SET_SELECTED_CATEGORY:
        const {selectedCategoryId, selectedCategoryIndex} = action.payload
      return {
        ...state,
        selectedCategoryId : selectedCategoryId,
        selectedCategoryIndex : parseInt(selectedCategoryIndex,10)
      };
      case SET_TODOS:
        const {todos} = action.payload
        var list = state.categories
        list[state.selectedCategoryIndex].todos = todos
        return {
          ...state,
          categories : list
        };
      case PURGE:
        return initialState
      default:
        return state;
    }
  }
  