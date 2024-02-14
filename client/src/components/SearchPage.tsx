import { Pagination } from "@mui/material";
import axios from "axios";
import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";

export function SearchPage() {
  const { search } = useLocation();
  const r = new URLSearchParams(search);
  const searchTerm = r.get("q");
  const [searchRes, setSearchRes] = useState<any>();
  useEffect(() => {
    axios.get("/search?q=" + searchTerm).then((res: any) => {
      console.log("search res", res.data);
      setSearchRes(res.data);
    });
  }, [searchTerm]);
  if (searchRes) {
    return (
      <>
        <h2>
          Search results for "{searchTerm}" ({searchRes?.total ?? 0})
        </h2>
        {searchRes.hits.map((doc: any) => (
          <ol key={doc._id}>
            <li>{doc._source.title}</li>
            <li>{doc._source.content}</li>
          </ol>
        ))}
        <Pagination count={Math.ceil(+searchRes.total / 2)} />
      </>
    );
  }
}
