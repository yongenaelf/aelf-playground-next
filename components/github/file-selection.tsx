import { useMemo } from "react";
import { FaSquare, FaCheckSquare, FaMinusSquare } from "react-icons/fa";
import { IoMdArrowDropright } from "react-icons/io";
import TreeView, { ITreeViewOnSelectProps } from "react-accessible-treeview";
import clsx from "clsx";
import { IconBaseProps } from "react-icons/lib";
import "./file-selection.css";
import { useRepoTree } from "./use-octokit";

function FileSelection({
  ownerrepo,
  branch,
  onSelect,
}: {
  ownerrepo?: string;
  branch?: string;
  onSelect?: (props: ITreeViewOnSelectProps) => void;
}) {
  const { data: repoData, isLoading } = useRepoTree(ownerrepo, branch);

  const data = useMemo(() => {
    if (!!repoData) {
      const tree = repoData;

      const root = {
        id: 0,
        children: tree
          .filter((i) => !i.path?.includes("/"))
          .map((i) => i.path!),
        parent: null,
        name: "",
      };

      const rest = tree.map((i) => ({
        id: i.path!,
        name: i.path?.split("/").pop() || "",
        children: tree
          .filter((j) => i.path === j.path?.split("/").slice(0, -1).join("/"))
          .map((k) => k.path!),
        parent:
          tree.find((j) => j.path === i.path?.split("/").slice(0, -2).join("/"))
            ?.path || root.id,
      }));

      return [root, ...rest];
    }

    return undefined;
  }, [repoData]);

  if (isLoading || !data) return <div>Loading...</div>;

  return (
    <div>
      <div className="checkbox">
        <TreeView
          data={data}
          aria-label="Checkbox tree"
          multiSelect
          propagateSelect
          propagateSelectUpwards
          togglableSelect
          onSelect={onSelect}
          nodeRenderer={({
            element,
            isBranch,
            isExpanded,
            isSelected,
            isHalfSelected,
            getNodeProps,
            level,
            handleSelect,
            handleExpand,
          }) => {
            return (
              <div
                {...getNodeProps({ onClick: handleExpand })}
                style={{ marginLeft: 40 * (level - 1) }}
              >
                {isBranch && <ArrowIcon isOpen={isExpanded} />}
                <CheckBoxIcon
                  className="checkbox-icon"
                  onClick={(e) => {
                    handleSelect(e);
                    e.stopPropagation();
                  }}
                  variant={
                    isHalfSelected ? "some" : isSelected ? "all" : "none"
                  }
                />
                <span className="name">{element.name}</span>
              </div>
            );
          }}
        />
      </div>
    </div>
  );
}

const ArrowIcon = ({
  isOpen,
  className,
}: {
  isOpen: boolean;
  className?: string;
}) => {
  const baseClass = "arrow";
  const classes = clsx(
    baseClass,
    { [`${baseClass}--closed`]: !isOpen },
    { [`${baseClass}--open`]: isOpen },
    className
  );
  return <IoMdArrowDropright className={classes} />;
};

const CheckBoxIcon = ({
  variant,
  ...rest
}: IconBaseProps & { variant: "all" | "none" | "some" | string }) => {
  switch (variant) {
    case "all":
      return <FaCheckSquare {...rest} />;
    case "none":
      return <FaSquare {...rest} />;
    case "some":
      return <FaMinusSquare {...rest} />;
    default:
      return null;
  }
};

export default FileSelection;
