import { useState, useEffect } from "react";
import { ScrollArea } from "./components/ui/scroll-area";
import { Plus } from "lucide-react";

interface Folder {
  title?: string;
  tabs?: Tab[];
}

interface Tab {
  id?: number;
  title?: string;
  url?: string;
}

function App() {
  const [folders, setFolders] = useState<Folder[]>([]);

  const handleSaveTabs = async () => {
    try {
      const tabList = await chrome.tabs.query({});
      const folder = {
        id: folders.length,
        title: `Folders ${folders.length}`,
        tabs: tabList,
      };
      setFolders([...folders, folder]);
      await chrome.storage.local.set({ savedFolders: [...folders, folder] });
    } catch (error) {
      console.error('Error saving tabs:', error);
    }
  };

  const loadSavedFolders = async () => {
    try {
      const result = await chrome.storage.local.get("savedFolders");
      if (result.savedFolders) {
        setFolders(result.savedFolders);
      }
    } catch (error) {
      console.error('Error loading saved folders:', error);
    }
  };

  useEffect(() => {
    loadSavedFolders();
  }, []);

  return (
    <div className="p-4 h-screen w-[400px]">
      <div className="grid grid-cols-1 gap-4">
        {folders?.map((folder, index) => (
          <div key={index} className="border p-4 rounded-md shadow">
            <h1 className="text-lg font-bold mb-4">{folder.title}</h1>
            <ScrollArea className="rounded-md border h-40">
              <div className="flex flex-col p-2 gap-1">
                {folder?.tabs?.map((tab) => (
                  <a
                    key={tab.id}
                    href={tab.url}
                    target="_blank"
                    rel="noreferrer"
                    className="hover:text-blue-500 bg-muted-foreground/20 w-full rounded-md px-1"
                  >
                    {tab.title}
                  </a>
                ))}
              </div>
            </ScrollArea>
          </div>
        ))}
        <div className="border p-4 rounded-md shadow">
          <button className="w-full border-4 border-dashed h-full flex items-center justify-center hover:border-muted-foreground text-gray-300 hover:text-muted-foreground" onClick={handleSaveTabs}>
            <Plus size={48} />
          </button>
        </div>
      </div>
    </div>
  );
}

export default App;
