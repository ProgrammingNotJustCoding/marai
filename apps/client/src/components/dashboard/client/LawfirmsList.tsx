import React from "react";
import LawfirmCard from "./LawfirmCard";

const lawfirms = [
  {
    id: "1",
    name: "Johnson & Partners LLP",
    imageUrl: "/images/logo-white.png",
    categories: ["Family Law", "Estate Planning"],
    location: "New York City",
    established: 1995,
    attorneys: 24,
    rating: 4.8,
    consultationFee: "150",
  },
  {
    id: "2",
    name: "Rodriguez Legal Group",
    imageUrl: "/images/logo-white.png",
    categories: ["Criminal Defense", "DUI"],
    location: "Los Angeles",
    established: 2005,
    attorneys: 12,
    rating: 4.5,
    consultationFee: "125",
  },
  {
    id: "3",
    name: "Williams & Thompson",
    imageUrl: "/images/logo-white.png",
    categories: ["Corporate Law", "Mergers & Acquisitions"],
    location: "Chicago",
    established: 1987,
    attorneys: 35,
    rating: 4.9,
    consultationFee: "200",
  },
  {
    id: "4",
    name: "Chen & Associates",
    imageUrl: "/images/logo-white.png",
    categories: ["Immigration", "Visa Applications"],
    location: "San Francisco",
    established: 2001,
    attorneys: 8,
    rating: 4.7,
    consultationFee: "175",
  },
  {
    id: "5",
    name: "Patel Real Estate Law",
    imageUrl: "/images/logo-white.png",
    categories: ["Real Estate", "Property Law"],
    location: "Houston",
    established: 2010,
    attorneys: 6,
    rating: 4.6,
    consultationFee: "140",
  },
  {
    id: "6",
    name: "Wilson Intellectual Property",
    imageUrl: "/images/logo-white.png",
    categories: ["Intellectual Property", "Patents"],
    location: "Seattle",
    established: 1998,
    attorneys: 15,
    rating: 4.8,
    consultationFee: "190",
  },
];

type LawfirmsListProps = {
  filters: {
    categories: string[];
    location: string | null;
    establishment: number | null;
    rating: number | null;
  };
};

const LawfirmsList: React.FC<LawfirmsListProps> = ({ filters }) => {
  const currentYear = new Date().getFullYear();

  const filteredLawfirms = lawfirms.filter((lawfirm) => {
    if (filters.categories.length > 0) {
      const lawfirmCategoriesLower = lawfirm.categories.map((c) =>
        c.toLowerCase(),
      );
      const hasMatchingCategory = filters.categories.some((categoryId) => {
        const categoryName =
          categoryId === "family"
            ? "family law"
            : categoryId === "criminal"
              ? "criminal defense"
              : categoryId === "real-estate"
                ? "real estate"
                : categoryId === "corporate"
                  ? "corporate law"
                  : categoryId === "intellectual"
                    ? "intellectual property"
                    : categoryId;

        return lawfirmCategoriesLower.some((c) =>
          c.includes(categoryName.toLowerCase()),
        );
      });

      if (!hasMatchingCategory) return false;
    }

    if (filters.location) {
      if (
        !lawfirm.location.toLowerCase().includes(filters.location.toLowerCase())
      ) {
        return false;
      }
    }

    if (filters.establishment !== null) {
      const yearsEstablished = currentYear - lawfirm.established;
      if (yearsEstablished < filters.establishment) {
        return false;
      }
    }

    if (filters.rating !== null && lawfirm.rating < filters.rating) {
      return false;
    }

    return true;
  });

  if (filteredLawfirms.length === 0) {
    return (
      <div className="py-10 text-center">
        <p className="text-gray-600 dark:text-neutral-400 text-lg">
          No law firms match your current filters. Try adjusting your criteria.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {filteredLawfirms.map((lawfirm) => (
        <LawfirmCard key={lawfirm.id} {...lawfirm} />
      ))}
    </div>
  );
};

export default LawfirmsList;
