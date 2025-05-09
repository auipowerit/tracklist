import { useEffect } from "react";
import "./filter-button.scss";

export default function FilterReviews(props) {
  const { review, setFilteredReviews, filter, setFilter } = props;

  useEffect(() => {
    if (!review) return;

    if (filter === "all") {
      setFilteredReviews(review);
      return;
    }

    const filteredReviews = review.filter(
      (review) => review.rating === Number(filter),
    );
    setFilteredReviews(filteredReviews);
  }, [filter]);

  function handleChange(e) {
    setFilter(e.target.value);
  }

  return (
    <div className="reviews-filter">
      <label htmlFor="star-filter" className="reviews-filter__label">
        Filter by
      </label>

      <select
        id="star-filter"
        name="star-filter"
        className="reviews-filter__select"
        value={filter}
        onChange={handleChange}
      >
        <option value="all">All</option>

        {/* Map through 5 to 0.5, decrementing by 0.5 */}
        {[...Array(10)].map((_, i) => {
          const rating = 5 - i * 0.5;

          return (
            <option key={rating} value={rating}>
              {rating} Stars
            </option>
          );
        })}
      </select>
    </div>
  );
}
