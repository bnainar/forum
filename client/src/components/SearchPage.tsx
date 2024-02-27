import { Pagination } from "@mui/material";
import axios from "axios";
import { useCallback, useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

export function SearchPage() {
  const { search } = useLocation();
  const r = new URLSearchParams(search);
  const searchTerm = r.get("q");
  const page = Number(r.get("page") ?? 0);
  const navigate = useNavigate();

  const [searchRes, setSearchRes] = useState<any>();
  const searchUrl = useCallback(
    (v: number) => "/search?q=" + searchTerm + "&page=" + v,
    [searchTerm]
  );
  useEffect(() => {
    axios.get(searchUrl(page)).then((res: any) => {
      setSearchRes(res.data);
    });
  }, [searchTerm, page]);
  const handleChange = (_: React.ChangeEvent<unknown>, value: number) => {
    navigate(searchUrl(value - 1));
  };
  if (searchRes) {
    return (
      <>
        <h2>
          Search results for "{searchTerm}" ({searchRes?.total ?? 0})
        </h2>
        {searchRes.hits.map((doc: any) => (
          <ul key={doc._id}>
            <li>{doc._source.title}</li>
            <li>{doc._source.content}</li>
          </ul>
        ))}
        <Pagination
          count={Math.ceil(+searchRes.total / 2)}
          onChange={handleChange}
        />
      </>
    );
  }
}
