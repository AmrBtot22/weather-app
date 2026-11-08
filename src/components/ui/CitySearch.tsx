import { Button } from "./button"
import { useState } from "react";
import { CommandDialog, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList, CommandSeparator } from "./command";
import { Clock, Loader2, Search, Star, XCircle } from "lucide-react";
import { useSearchLocations } from "@/hooks/Use-weather";
import { useNavigate } from "react-router-dom";
import { useSearchHistory } from "@/hooks/Use-Search-History";
import { format } from "date-fns";
import { useFavorites } from "@/hooks/Use-Fav";

const CitySearch =()=> {
const [open, setOpen] = useState(false);
const [query, setQuery]=useState("");
const navigate = useNavigate();
const{data:location,isLoading} = useSearchLocations(query)
const { history, clearHistory, addToHistory } = useSearchHistory();
const handelSelect = (cityData: string) => {
const [lat, lon, name, country] = cityData.split("|");
// Add to search history
addToHistory.mutate({
query,
name,
lat: parseFloat(lat),
lon: parseFloat(lon),
country,
}); 
setOpen(false);
navigate(`/city/${name}?lat=${lat}&lon=${lon}`);
};
const { favorites } =useFavorites()
return (
<>
<Button
variant={"outline"}
className=" relative w-full justify-start text-sm text-muted-foreground sm:pr-12 md:w-40 lg:w-64 "
 onClick={() => setOpen (true)}>
    <Search className="mr-2 h-4 w-4" />
    Search cities...</Button>
<CommandDialog open={open} onOpenChange={setOpen}>
      <CommandInput placeholder="Search Cityes..."
      value={query}
      onValueChange={setQuery}
      />
      <CommandList>
        {query.length>2 && !isLoading &&(<CommandEmpty>No city found.</CommandEmpty>)}

        {favorites.length >0 &&(
       <CommandGroup heading="Fav">
       {history.map((location)=>{
        return    <CommandItem
                 key={location.id}
                 value={`${location.lat}|${location.lon}|${location.name}|${location.country}`}
                 onSelect={handelSelect}
                 >
                  <Star className="mr-2 h-4 w-4 text-yellow-500" />
                 <span>{location.name}</span>
                 {location.state && (
<span className="text-sm text-muted-foreground">
, {location.state}
</span>
         )} 
<span className="text-sm text-muted-foreground">
{location.country}
</span>
      </CommandItem>
       })}
       </CommandGroup>
       )}
       
       
       {history.length >0 &&(
       <>
       <CommandSeparator />
       <CommandGroup>
       <div className=" flex items-center justify-between px-2 my-2">
       <p className="text-xs text-muted-foreground">Recent Searches</p>
       <Button
       variant="ghost"
       size="sm"
       onClick={() => clearHistory.mutate()}
       >
       < XCircle className="h-4 w-4" />
       Clear
       </Button>
       </div>
       {history.map((location)=>{
        return    <CommandItem
                 key={`${location.lat}-${location.lon}`}
                 value={`${location.lat}|${location.lon}|${location.name}|${location.country}`}
                 onSelect={handelSelect}
                 >
                  <Clock className="mr-2 h-4 w-4 text-muted-foreground" />
                 <span>{location.name}</span>
                 {location.state && (
<span className="text-sm text-muted-foreground">
, {location.state}
</span>
         )} 
<span className="text-sm text-muted-foreground">
{location.country}
</span>
<span className="ml-auto text-xs text-muted-foreground">
{format(location.searchedAt, "MMM, h:mm a")}
</span>
      </CommandItem>
       })}
       </CommandGroup>
       </> 
       )}
       <CommandSeparator />
       {location && location.length > 0 && (
        <CommandGroup heading="Suggestions">
         {isLoading && (
        <div className="flex items-center justify-center p-4">
         <Loader2 className="h-4 w-4 animate-spin" />
        </div>
         )}
         {location.map((location)=>{
          return(
                 <CommandItem
                 key={`${location.lat}-${location.lon}`}
                 value={`${location.lat}|${location.lon}|${location.name}|${location.country}`}
                 onSelect={handelSelect}
                 >
                  <Search className="mr-2 h-4 w-4" />
                 <span>{location.name}</span>
                 {location.state && (
<span className="text-sm text-muted-foreground">
, {location.state}
</span>
         )} 
<span className="text-sm text-muted-foreground">
{location.country}
</span>
                 </CommandItem>

          )
         })}
         </CommandGroup>
)}
       </CommandList>
    </CommandDialog>
</>
);
}

export default CitySearch 