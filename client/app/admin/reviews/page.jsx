"use client";

import { useEffect, useMemo, useState } from "react";
import {
  Check,
  ChevronDown,
  ChevronUp,
  MoreHorizontal,
  Search,
  SlidersHorizontal,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import {
  deleteReview,
  getAdminReviews,
  updateReviewStatus,
} from "@/services/review.service";

export default function ReviewsPage() {
  const [reviews, setReviews] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortField, setSortField] = useState("createdAt");
  const [sortDirection, setSortDirection] = useState("desc");
  const [statusFilter, setStatusFilter] = useState("all");

  useEffect(() => {
    const loadReviews = async () => {
      try {
        const result = await getAdminReviews();

        if (!result?.success) {
          throw new Error(result?.message || "Failed to fetch reviews");
        }

        setReviews(Array.isArray(result.data) ? result.data : []);
      } catch (error) {
        toast.error(
          error instanceof Error ? error.message : "Failed to fetch reviews",
        );
      } finally {
        setIsLoading(false);
      }
    };

    loadReviews();
  }, []);

  // Filter and sort reviews
  const filteredReviews = useMemo(() => {
    const loweredQuery = searchQuery.toLowerCase();

    return reviews
      .filter(
        (review) =>
          (statusFilter === "all" || review.status === statusFilter) &&
          (String(review.userName || "")
            .toLowerCase()
            .includes(loweredQuery) ||
            String(review.comment || "")
              .toLowerCase()
              .includes(loweredQuery) ||
            String(review.movieTitle || "")
              .toLowerCase()
              .includes(loweredQuery)),
      )
      .sort((a, b) => {
        if (sortField === "createdAt") {
          const aTime = new Date(a.createdAt).getTime();
          const bTime = new Date(b.createdAt).getTime();
          return sortDirection === "asc" ? aTime - bTime : bTime - aTime;
        }

        if (sortField === "rating") {
          const aRating = Number(a.rating || 0);
          const bRating = Number(b.rating || 0);
          return sortDirection === "asc"
            ? aRating - bRating
            : bRating - aRating;
        }

        const aValue = String(a?.[sortField] || "");
        const bValue = String(b?.[sortField] || "");

        return sortDirection === "asc"
          ? aValue.localeCompare(bValue)
          : bValue.localeCompare(aValue);
      });
  }, [reviews, searchQuery, sortDirection, sortField, statusFilter]);

  const handleReviewStatus = async (reviewId, status) => {
    try {
      const result = await updateReviewStatus(reviewId, status);

      if (!result?.success) {
        throw new Error(result?.message || "Failed to update review");
      }

      setReviews((current) =>
        current.map((review) =>
          review.id === reviewId ? { ...review, status } : review,
        ),
      );
      toast.success(`Review ${status}.`);
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Failed to update review",
      );
    }
  };

  const handleDeleteReview = async (reviewId) => {
    try {
      const result = await deleteReview(reviewId);

      if (!result?.success) {
        throw new Error(result?.message || "Failed to delete review");
      }

      setReviews((current) =>
        current.filter((review) => review.id !== reviewId),
      );
      toast.success("Review deleted.");
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Failed to delete review",
      );
    }
  };

  const handleSort = (field) => {
    if (field === sortField) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  };

  const getSortIcon = (field) => {
    return sortDirection === "asc" ? (
      <ChevronUp className="ml-1 h-4 w-4" />
    ) : (
      <ChevronDown className="ml-1 h-4 w-4" />
    );
  };

  const getStatusBadgeClass = (status) => {
    if (status === "approved") {
      return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300";
    }

    if (status === "pending") {
      return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300";
    }

    return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300";
  };

  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Reviews</h2>
        <p className="text-muted-foreground">
          Moderate user reviews before they appear on the site
        </p>
      </div>

      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="flex w-full items-center space-x-2 md:w-1/2">
          <Search className="h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search reviews..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="h-9"
          />
        </div>
        <div className="flex items-center gap-2">
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="h-9 w-45">
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Reviews</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="approved">Approved</SelectItem>
              <SelectItem value="rejected">Rejected</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" size="sm" className="h-9">
            <SlidersHorizontal className="mr-2 h-4 w-4" />
            Filters
          </Button>
        </div>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-20">ID</TableHead>
              <TableHead>User</TableHead>
              <TableHead>Movie</TableHead>
              <TableHead>Rating</TableHead>
              <TableHead>Comment</TableHead>
              <TableHead>Status</TableHead>
              <TableHead
                className="cursor-pointer"
                onClick={() => handleSort("createdAt")}>
                <div className="flex items-center">
                  Date
                  {getSortIcon("createdAt")}
                </div>
              </TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {!isLoading && filteredReviews.length === 0 && (
              <TableRow>
                <TableCell colSpan={8} className="h-24 text-center">
                  No reviews found.
                </TableCell>
              </TableRow>
            )}
            {filteredReviews.map((review) => {
              return (
                <TableRow key={review.id}>
                  <TableCell className="font-medium">{review.id}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Avatar className="h-8 w-8">
                        <AvatarImage
                          src={review.userAvatar || review.userProfilePicture}
                          alt={review.userName}
                        />
                        <AvatarFallback>
                          {review.userName.charAt(0)}
                        </AvatarFallback>
                      </Avatar>
                      <span>{review.userName}</span>
                    </div>
                  </TableCell>
                  <TableCell>{review.movieTitle}</TableCell>
                  <TableCell>{review.rating}/10</TableCell>
                  <TableCell className="max-w-75">
                    <p className="truncate">{review.comment}</p>
                  </TableCell>
                  <TableCell>
                    <Badge className={getStatusBadgeClass(review.status)}>
                      {review.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {new Date(review.createdAt).toLocaleDateString()}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      {review.status === "pending" && (
                        <>
                          <Button
                            variant="outline"
                            size="icon"
                            className="h-8 w-8"
                            onClick={() =>
                              handleReviewStatus(review.id, "approved")
                            }>
                            <Check className="h-4 w-4 text-green-600" />
                          </Button>
                          <Button
                            variant="outline"
                            size="icon"
                            className="h-8 w-8"
                            onClick={() =>
                              handleReviewStatus(review.id, "rejected")
                            }>
                            <X className="h-4 w-4 text-red-600" />
                          </Button>
                        </>
                      )}
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" className="h-8 w-8 p-0">
                            <span className="sr-only">Open menu</span>
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuLabel>Actions</DropdownMenuLabel>
                          <DropdownMenuItem>View Full Review</DropdownMenuItem>
                          <DropdownMenuItem>View Movie</DropdownMenuItem>
                          <DropdownMenuItem>View User</DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem
                            className="text-destructive"
                            onSelect={() => handleDeleteReview(review.id)}>
                            Delete Review
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
