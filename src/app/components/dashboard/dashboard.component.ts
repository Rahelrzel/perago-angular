  import { Component, OnInit } from '@angular/core';
import { NzTreeNodeOptions } from 'ng-zorro-antd/tree';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }



    isCollapsed = false;
    currentYear = new Date().getFullYear();

  
    employeeHierarchy: NzTreeNodeOptions[] = [
      {
        title: 'CEO',
        key: 'ceo',
        expanded: true,
        children: [
          {
            title: 'CTO',
            key: 'cto',
            expanded: true,
            children: [
              {
                title: 'Project Manager',
                key: 'project-manager',
                expanded: true,
                children: [
                  {
                    title: 'Product Owner',
                    key: 'product-owner',
                    expanded: true,
                    children: [
                      {
                        title: 'Tech Lead',
                        key: 'tech-lead',
                        expanded: true,
                        children: [
                          { title: 'Frontend Developer', key: 'frontend-dev', isLeaf: true },
                          { title: 'Backend Developer', key: 'backend-dev', isLeaf: true },
                          { title: 'DevOps Engineer', key: 'devops-engineer', isLeaf: true },
                          { title: '...', key: 'tech-other', isLeaf: true }
                        ]
                      },
                      { title: 'QA Engineer', key: 'qa-engineer', isLeaf: true },
                      { title: 'Scrum Master', key: 'scrum-master', isLeaf: true },
                      { title: '...', key: 'po-other', isLeaf: true }
                    ]
                  }
                ]
              }
            ]
          },
          {
            title: 'CFO',
            key: 'cfo',
            expanded: true,
            children: [
              {
                title: 'Chief Accountant',
                key: 'chief-accountant',
                expanded: true,
                children: [
                  { title: 'Financial Analyst', key: 'financial-analyst', isLeaf: true },
                  { title: 'Account Payable', key: 'account-payable', isLeaf: true }
                ]
              },
              { title: 'Internal Audit', key: 'internal-audit', isLeaf: true }
            ]
          },
          {
            title: 'COO',
            key: 'coo',
            expanded: true,
            children: [
              { title: 'Product Manager', key: 'coo-product-manager', isLeaf: true },
              { title: 'Operation Manager', key: 'operation-manager', isLeaf: true },
              { title: 'Customer Relation', key: 'customer-relation', isLeaf: true },
              { title: '...', key: 'coo-other', isLeaf: true }
            ]
          },
          {
            title: 'HR',
            key: 'hr',
            isLeaf: true
          }
        ]
      }
    ];
  
    onSelect(event: any): void {
      console.log('Node selected:', event);
    }
}
