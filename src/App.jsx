/* eslint-disable jsx-a11y/accessible-emoji */
import React from 'react';
import './App.scss';
import { useState } from 'react';

import usersFromServer from './api/users';
import categoriesFromServer from './api/categories';
import productsFromServer from './api/products';

const products = productsFromServer.map(product => {
  const category = categoriesFromServer.find(
    category => category.id === product.categoryId,
  );
  const user = usersFromServer.find(user => user.id === category.ownerId);

  return {
    ...product,
    category,
    user,
  };
});

export const App = () => {
  const [selectedUserId, setSelectedUserId] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategoryIds, setSelectedCategoryIds] = useState([]);
  const [sortType, setSortType] = useState('');
  const [isReversed, setIsReversed] = useState(false);

  const getSortedProducts = (products, sortType, isReversed) => {
    if (!sortType) {
      return products;
    }
    const sorted = [...products].sort ((a,b) => {
      let aValue, bValue;
      if (sortType === 'id') {
        aValue = a.id;
        bValue = b.id;
      } else if (sortType === 'name') {
        aValue = a.name.toLowerCase();
        bValue = b.name.toLowerCase();
      } else if (sortType === 'category') {
        aValue = a.category.title.toLowerCase();
        bValue = b.category.title.toLowerCase();
      } else if (sortType === 'user') {
        aValue = a.user.name.toLowerCase();
        bValue = b.user.name.toLowerCase();
      }
      if (aValue < bValue) return isReversed ? 1 : -1;
      if (aValue > bValue) return isReversed ? -1 : 1;
      return 0;
    });

    return sorted;
  }

  const filteredProducts = products
  .filter(product =>
    selectedUserId ? product.user.id === selectedUserId : true)
  .filter(product =>
    product.name.toLowerCase().includes(searchQuery.toLowerCase()))
  .filter(product =>
    selectedCategoryIds.length === 0 ? true :
    selectedCategoryIds.includes(product.category.id));


  const handleCategoryToggle = (categoryId) => {
    setSelectedCategoryIds(prev =>
      prev.includes(categoryId)
        ? prev.filter(id => id !== categoryId)
        : [...prev, categoryId]
    );
  };

  const handleSort = (type) => {
    if (sortType !== type) {
      setSortType(type);
      setIsReversed(false);
    }
    else if (!isReversed) {
      setIsReversed(true);
    } else {
      setSortType('');
      setIsReversed(false);
    }
  };

  const sortedProducts = getSortedProducts(filteredProducts, sortType, isReversed);


  return (
    <div className="section">
      <div className="container">
        <h1 className="title">Product Categories</h1>

        <div className="block">
          <nav className="panel">
            <p className="panel-heading">Filters</p>

            <p className="panel-tabs has-text-weight-bold">
              <a
                data-cy="FilterAllUsers"
                href="#/"
                onClick={() => setSelectedUserId(null)}
                className={selectedUserId === null ? 'is-active' : ''}
              >
                All
              </a>
              {usersFromServer.map(user => (
                <a
                  data-cy="FilterUser"
                  href="#/"
                  key={user.id}
                  onClick={() => setSelectedUserId(user.id)}
                  className={selectedUserId === user.id ? 'is-active' : ''}
                >
                  {user.name}
                </a>
              ))}
            </p>

            <div className="panel-block">
              <p className="control has-icons-left has-icons-right">
                <input
                  data-cy="SearchField"
                  type="text"
                  className="input"
                  placeholder="Search"
                  value={searchQuery}
                  onChange={event => setSearchQuery(event.target.value)}
                />

                <span className="icon is-left">
                  <i className="fas fa-search" aria-hidden="true" />
                </span>

                {searchQuery && (
                  <span className="icon is-right">
                    {/* eslint-disable-next-line jsx-a11y/control-has-associated-label */}
                    <button
                      data-cy="ClearButton"
                      type="button"
                      className="delete"
                      onClick={() => setSearchQuery('')}
                    />
                  </span>
                )}
              </p>
            </div>

            <div className="panel-block is-flex-wrap-wrap">
              <a
                href="#/"
                data-cy="AllCategories"
                className={`button is-success mr-6
                  ${selectedCategoryIds.length === 0 ? ''
                    : 'is-outlined'}`}
                onClick={() => setSelectedCategoryIds([])}
              >
                All
              </a>

              {categoriesFromServer.map(category => (
                <a
                  key={category.id}
                  data-cy="Category"
                  className={`button mr-2 my-1 ${selectedCategoryIds
                    .includes(category.id) ?
                     'is-info' : ''}`}
                  href="#/"
                  onClick={() => handleCategoryToggle(category.id)}
                >
                  {category.title}
                </a>
              ))}
            </div>

            <div className="panel-block">
              <a
                data-cy="ResetAllButton"
                href="#/"
                className="button is-link is-outlined is-fullwidth"
                onClick={() => {
                  setSelectedUserId(null);
                  setSearchQuery('');
                  setSelectedCategoryIds([]);
                  setSortType('');
                  setIsReversed(false);
                }}
              >
                Reset all filters
              </a>
            </div>
          </nav>
        </div>

        <div className='box table-container'>

          {filteredProducts.length === 0 ? (
            <p data-cy="NoMatchingMessage">
              No products matching selected criteria
            </p>
          ) : (
            <table
              data-cy="ProductTable"
              className="table is-striped is-narrow is-fullwidth"
            >
              <thead>
                <tr>
                  <th>
                    <span className="is-flex is-flex-wrap-nowrap">
                      ID
                      <a
                      href="#/"
                      onClick={handleSort('id')}
                      >
                        <span className="icon">
                          <i data-cy="SortIcon" className="fas fa-sort" />
                        </span>
                      </a>
                    </span>
                  </th>

                  <th>
                    <span className="is-flex is-flex-wrap-nowrap">
                      Product
                      <a
                      href="#/"
                      onClick={() => handleSort('name')}
                      >
                        <span className="icon">
                          <i data-cy="SortIcon" className="fas fa-sort-down" />
                        </span>
                      </a>
                    </span>
                  </th>

                  <th>
                    <span className="is-flex is-flex-wrap-nowrap">
                      Category
                      <a
                      href="#/"
                      onClick={() => handleSort('category')}
                      >
                        <span className="icon">
                          <i data-cy="SortIcon" className="fas fa-sort-up" />
                        </span>
                      </a>
                    </span>
                  </th>

                  <th>
                    <span className="is-flex is-flex-wrap-nowrap">
                      User
                      <a
                      href="#/"
                      onClick={() => handleSort('user')}
                      >
                        <span className="icon">
                          <i data-cy="SortIcon" className="fas fa-sort" />
                        </span>
                      </a>
                    </span>
                  </th>
                </tr>
              </thead>

              <tbody>
                {sortedProducts.map(product => (
                  <tr data-cy="Product" key={product.id}>
                    <td className="has-text-weight-bold" data-cy="ProductId">
                      {product.id}
                    </td>

                    <td data-cy="ProductName">{product.name}</td>
                    <td data-cy="ProductCategory">
                      {product.category.icon} - {product.category.title}
                    </td>

                    <td
                      data-cy="ProductUser"
                      className={
                        product.user.sex === 'f'
                          ? 'has-text-danger'
                          : 'has-text-link'
                      }
                    >
                      {product.user.name}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
};

