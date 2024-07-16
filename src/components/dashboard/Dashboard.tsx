"use client";

import { useEffect, useState } from "react";
import {
  CartesianGrid,
  XAxis,
  Line,
  LineChart,
  Pie,
  PieChart,
  Bar,
  BarChart,
} from "recharts";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import {
  ChartTooltipContent,
  ChartTooltip,
  ChartContainer,
} from "@/components/ui/chart";
import {
  ArrowLeftIcon,
  CalendarDaysIcon,
  ChevronDownIcon,
} from "./dashboardIcons";
import { TreeNode } from "../categoryTree/Tree";
import { useCategoryStore } from "@/stores/store";
import { findCategoryNode } from "@/utils/treeNavigation";
import Navigator from "../Navigator";
import { createClient } from "@/utils/supabase/client";

import { Database } from '../../database.types'

const colors = [
  "#FF6384", // Bright Pink
  "#36A2EB", // Sky Blue
  "#FFCE56", // Sunny Yellow
  "#4BC0C0", // Teal
  "#9966FF", // Purple
];

type Tables = Database['public']['Tables']

export default function Dashboard() {

  const supabase = createClient();
  const categories = useCategoryStore((state) => state.categories);
  const setCategories = useCategoryStore((state) => state.setCategories);
  const [selectedCategoryNode, setSelectedCategoryNode] = useState<TreeNode | undefined>(undefined);

  const [dateRange, setDateRange] = useState([
    new Date(new Date().setDate(new Date().getDate() - 30)),
    new Date(),
  ]);
  const handleDateRangeChange = (range: any) => {
    setDateRange(range);
  };
  const handlePresetDateRange = (preset: string) => {
    switch (preset) {
      case "week":
        setDateRange([
          new Date(new Date().setDate(new Date().getDate() - 6)),
          new Date(),
        ]);
        break;
      case "2weeks":
        setDateRange([
          new Date(new Date().setDate(new Date().getDate() - 13)),
          new Date(),
        ]);
        break;
      case "month":
        setDateRange([
          new Date(new Date().setMonth(new Date().getMonth() - 1)),
          new Date(),
        ]);
        break;
      case "year":
        setDateRange([
          new Date(new Date().setFullYear(new Date().getFullYear() - 1)),
          new Date(),
        ]);
        break;
      default:
        setDateRange([
          new Date(new Date().setDate(new Date().getDate() - 30)),
          new Date(),
        ]);
        break;
    }
  };
  const renderCategoryCards = (category: TreeNode) => {
    console.log({ category })
    if (!category) {
      return <></>
    }
    return (
      <Card key={category.id} className="w-full">
        <CardHeader>
          <CardTitle>{category.name}</CardTitle>
          <CardDescription>
            Overview of your {category?.name.toLowerCase()}-related expenses
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col gap-2">
            <div className="flex items-center justify-between">
              <span>Total Spent</span>
              <span className="font-bold">$0.00</span>
            </div>
            <div className="flex items-center justify-between">
              <span>Transactions</span>
              <span className="font-bold">0</span>
            </div>
            <div className="flex items-center justify-between">
              <span>Average Spend</span>
              <span className="font-bold">$0.00</span>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  };


  const createNodeMap = (nodes: Tables['categories']['Row'][]): Map<string, TreeNode> => {
    const nodeMap = new Map<string, TreeNode>();
    nodes.forEach(node => {
      nodeMap.set(node.id, { ...node, children: [] });
    });
    return nodeMap;
  };

  const linkNodes = (nodeMap: Map<string, TreeNode>, connections: Tables['category_paths']['Row'][]): void => {
    connections.forEach(connection => {
      const parent = nodeMap.get(connection.ancestor_id);
      const child = nodeMap.get(connection.descendant_id);
      if (parent && child) {
        parent.children.push(child);
      }
    });
  };

  const findRootNodes = (nodes: Tables['categories']['Row'][], connections: Tables['category_paths']['Row'][]): TreeNode[] => {
    const childIds = new Set(connections.map(connection => connection.descendant_id));
    return nodes
      .filter(node => !childIds.has(node.id))
      .map(node => ({ ...node, children: [] }));
  };

  const parseTree = (nodes: Tables['categories']['Row'][], connections: Tables['category_paths']['Row'][]): TreeNode[] => {
    const nodeMap = createNodeMap(nodes);
    linkNodes(nodeMap, connections);
    const rootNodes = findRootNodes(nodes, connections);

    // Ensure that the root nodes have their children linked
    return rootNodes.map(root => nodeMap.get(root.id)!);
  };

  useEffect(() => {

    const loadCategories = async () => {
      const {
        data: { user },
        error: authError
      } = await supabase.auth.getUser();

      if (authError) {
        throw new Error(authError.message)
      }

      if (!user) {
        throw new Error("Error retrieving user")
      }

      const { data: categoryData, error: categoryError } = await supabase
        .from('categories')
        .select('id, name, user_id')
        .eq('user_id', user.id)
        .returns<Tables['categories']['Row'][]>()

      if (categoryError) {
        throw new Error(categoryError.message)
      }

      const { data: pathData, error: pathError } = await supabase
        .from('category_paths')
        .select('user_id, ancestor_id, descendant_id')
        .eq('user_id', user.id)
        .returns<Tables['category_paths']['Row'][]>()

      if (pathError) {
        throw new Error(pathError.message)
      }

      const tree: TreeNode[] = parseTree(categoryData, pathData)
      setCategories(tree)
      if (tree.length > 0) {
        setSelectedCategoryNode(tree[0]); // Set to the first root node
      }
    }

    loadCategories()
  }, [])

  if (!selectedCategoryNode) {
    return <div>Loading...</div>;
  }

  return (
    <div className="pt-[84px]">
      <div className="fixed top-0 left-0 w-full z-10 flex justify-between items-center p-4 md:px-6 bg-white">
        <div className="grid gap-1">
          <h1 className="text-2xl font-bold">
            {selectedCategoryNode?.name || "Dashboard"}
          </h1>
          <div className="flex flex-wrap gap-2">
            {selectedCategoryNode?.children.map((category: TreeNode) => (
              <div
                key={category.id}
                className="bg-muted px-3 py-1 rounded-full bg-neutral-100 cursor-pointer"
                onClick={() => { }}
              >
                {category.name}
              </div>
            ))}
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" className="flex items-center">
                Navigator
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-80">
              <Navigator />
            </PopoverContent>
          </Popover>
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" className="flex items-center gap-2">
                <CalendarDaysIcon className="w-4 h-4" />
                <span>
                  {dateRange[0].toLocaleDateString()} -{" "}
                  {dateRange[1].toLocaleDateString()}
                </span>
                <ChevronDownIcon className="w-4 h-4" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="p-0 w-80">
              <div className="grid gap-4 p-4">
                <Calendar
                  mode="range"
                  value={dateRange}
                  onValueChange={handleDateRangeChange}
                  numberOfMonths={2}
                  className="[&_td]:w-10 [&_td]:h-10 [&_th]:w-10 [&_[name=day]]:w-10 [&_[name=day]]:h-10 [&>div]:space-x-0 [&>div]:gap-6 bg-white"
                />
                <div className="grid grid-cols-2 gap-2">
                  <Button
                    variant="outline"
                    onClick={() => handlePresetDateRange("week")}
                  >
                    Last 7 Days
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => handlePresetDateRange("2weeks")}
                  >
                    Last 2 Weeks
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => handlePresetDateRange("month")}
                  >
                    Last Month
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => handlePresetDateRange("year")}
                  >
                    Last Year
                  </Button>
                </div>
              </div>
            </PopoverContent>
          </Popover>
        </div>
      </div>
      <div className="grid grid-cols-1 gap-6 p-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {selectedCategoryNode && renderCategoryCards(selectedCategoryNode)}
        {selectedCategoryNode?.children.map(renderCategoryCards)}
        <Card className="w-full">
          <CardHeader>
            <CardTitle>Spending Overview</CardTitle>
            <CardDescription>
              Overview of your{" "}
              {selectedCategoryNode?.name.toLowerCase() || "total"} expenses
            </CardDescription>
          </CardHeader>
          <CardContent>
            <LineChartComponent
              selectedCategoryNode={selectedCategoryNode}
              className="w-full aspect-[9/4]"
            />
          </CardContent>
        </Card>
        <Card className="w-full">
          <CardHeader>
            <CardTitle>Subcategory Breakdown</CardTitle>
            <CardDescription>
              Spending distribution across{" "}
              {selectedCategoryNode?.name.toLowerCase() || "all"} subcategories
            </CardDescription>
          </CardHeader>
          <CardContent>
            <PieChartComponent
              selectedCategoryNode={selectedCategoryNode}
              className="w-full aspect-square"
            />
          </CardContent>
        </Card>
        <Card className="w-full">
          <CardHeader>
            <CardTitle>Weekly Spending</CardTitle>
            <CardDescription>
              Track your weekly{" "}
              {selectedCategoryNode?.name.toLowerCase() || "total"} expenses
            </CardDescription>
          </CardHeader>
          <CardContent>
            <BarChartComponent
              selectedCategoryNode={selectedCategoryNode}
              className="w-full aspect-[9/4]"
            />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function LineChartComponent({
  selectedCategoryNode,
  ...props
}: { selectedCategoryNode: TreeNode } & React.HTMLAttributes<HTMLDivElement>) {
  const config = selectedCategoryNode.children.reduce((acc, child, index) => {
    acc[child.id] = {
      label: child.name,
      color: colors[index % colors.length],
    };
    return acc;
  }, {} as Record<string, { label: string; color: string }>);

  const data = selectedCategoryNode.children.map((child, index) => ({
    month: child.name,
    value: 100, // Replace with actual data
  }));

  return (
    <div {...props}>
      <ChartContainer config={config}>
        <LineChart
          accessibilityLayer
          data={data}
          margin={{
            left: 12,
            right: 12,
          }}
        >
          <CartesianGrid vertical={false} />
          <XAxis
            dataKey="month"
            tickLine={false}
            axisLine={false}
            tickMargin={8}
            tickFormatter={(value) => value.slice(0, 3)}
          />
          <ChartTooltip
            cursor={false}
            content={<ChartTooltipContent hideLabel />}
          />
          {selectedCategoryNode.children.map((child, index) => (
            <Line
              key={child.id}
              dataKey="value"
              type="natural"
              stroke={colors[index % colors.length]}
              strokeWidth={2}
              dot={false}
            />
          ))}
        </LineChart>
      </ChartContainer>
    </div>
  );
}

function BarChartComponent({
  selectedCategoryNode,
  ...props
}: { selectedCategoryNode: TreeNode } & React.HTMLAttributes<HTMLDivElement>) {
  const config = selectedCategoryNode.children.reduce((acc, child, index) => {
    acc[child.id] = {
      label: child.name,
      color: colors[index % colors.length],
    };
    return acc;
  }, {} as Record<string, { label: string; color: string }>);

  const data = selectedCategoryNode.children.map((child, index) => ({
    month: child.name,
    value: 100, // Replace with actual data
  }));

  return (
    <div {...props}>
      <ChartContainer config={config} className="min-h-[300px]">
        <BarChart accessibilityLayer data={data}>
          <CartesianGrid vertical={false} />
          <XAxis
            dataKey="month"
            tickLine={false}
            tickMargin={10}
            axisLine={false}
            tickFormatter={(value) => value.slice(0, 3)}
          />
          <ChartTooltip
            cursor={false}
            content={<ChartTooltipContent hideLabel />}
          />
          {selectedCategoryNode.children.map((child, index) => (
            <Bar
              key={child.id}
              dataKey="value"
              fill={colors[index % colors.length]}
              radius={8}
            />
          ))}
        </BarChart>
      </ChartContainer>
    </div>
  );
}

function PieChartComponent({
  selectedCategoryNode,
  ...props
}: { selectedCategoryNode: TreeNode } & React.HTMLAttributes<HTMLDivElement>) {
  const config = selectedCategoryNode.children.reduce((acc, child, index) => {
    acc[child.id] = {
      label: child.name,
      color: colors[index % colors.length],
    };
    return acc;
  }, {} as Record<string, { label: string; color: string }>);

  const data = selectedCategoryNode.children.map((child, index) => ({
    category: child.name,
    value: 100, // Replace with actual data
    fill: colors[index % colors.length],
  }));

  return (
    <div {...props}>
      <ChartContainer config={config}>
        <PieChart>
          <ChartTooltip
            cursor={false}
            content={<ChartTooltipContent hideLabel />}
          />
          <Pie data={data} dataKey="value" nameKey="category" />
        </PieChart>
      </ChartContainer>
    </div>
  );
}
