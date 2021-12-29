<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Document</title>
</head>
<body>
  <script>const { log, dir } = console

  派生类/子类
  超类/父类/基类

  // 设计原则：
  // 单一职责原则
  // 里氏替换原则：一个软件实体如果使用的是一个父类的话，那么一定适用于其子类，而且它察觉不出父类对象和子类对象之间的区别。也就是说，在软件里面，把父类都替换成它的子类，程序的行为没有发生变化
  //   对继承进行规范上的约束：
  //   子类可以实现父类的抽象方法，但不能覆盖父类的非抽象方法
  //   子类中可以增加自己特有的方法
  //   当子类的方法重载父类的方法时，方法的前置条件（即方法的形参）要比父类方法的输入参数更宽松
  //   当子类的方法实现父类的抽象方法时，方法的后置条件（即方法的返回值）要比父类更严格
  // 依赖倒置原则：
  //   正常依赖：结构化编程思维 习惯性导致 高层代码依赖于低层代码；
  //   1. 引入间接层，让低层代码依赖于高层代码定义好的接口；二者应依赖于抽象
  //   2. 细节依赖于抽象，而不应该抽象依赖细节/针对接口编程，不要对实现编程
  //   将变与不变分开
  // 接口隔离原则：拆分胖接口，让使用者不依赖于他们使用不到的接口
  // 迪米特法则：不希望类之间建立直接的联系。如果真的有需要建立联系，也希望能通过它的友元类来转达，门面模式（Facade）和中介模式（Mediator）
  // 开放封闭原则：对拓展开放，对修改关闭
  // 合成/聚合复用原则

  // 软件设计是什么？
  // 软件设计：是要在问题和解决方案间架设一座桥梁，要关注长期变化，是应对需求的“算法”吗，应对需求规模的膨胀。算法对抗的是数据的规模，而软件设计对抗的是需求的规模
  // 软件设计的核心：模型、接口和实现
  // 学习软件设计的能力：是让你的把控能力从一段代码扩展到一个模块，再扩展到一个子系统，再扩展到一个大系统的必备手艺

  // 关注点分离：软件设计至关重要的一步
  // 业务处理和技术实现两个最基本的关注点纬度，不同纬度关注点不应该混淆为同一模块或同一功能
  

  // 需求：
  //   功能性需求
  //   非功能性需求
  //     执行质量 性能
  //       延迟 
  //       安全
  //       吞吐 ...
  //     演化质量
  //       可测试性（在设计中考虑可测试性，就是在设计时问一下，这个函数/模块/系统怎么测，在软件开发中，只有把一个一个的小模块做了足够的测试，我们才会有稳定的构造块，才可以在集成测试的时候，只关注最终的结果） 
  //       可拓展性 
  //       可维护性

  // 编程范式：
  //   非结构化：汇编 线性代码 不利于复杂程序 难以维护 功能无法被分解
  //   结构化：解决非结构化编程的缺点 但是抽象级别还不够高
  //   面向对象：一种更好的组织代码的方式
  //     封装：
  //       要设计出一个一个可以组合，可以复用的单元
  //       先考虑类的行为，根据行为提供对应方法，最后考虑实现这些方法需要哪些字段；行为的命名要突出意图，而不是实现
  //       不变类 不要暴露实现细节 减少对外暴露的接口 (public private)
  //       高内聚低耦合
  //     继承：实现继承，接口继承
  //     多态：构建抽象，会以接口的形式体现出来；接口将变的部分和不变的部分隔离开来：不变的是接口约定，变的是子类实现。适应未来变化
  //   函数式：




  // 耦合
  // 内容耦合：一个模块直接访问另一模块的内容
  // 公共耦合：一组模块都访问同一个全局数据结构
  // 外部耦合：一组模块都访问同一全局简单变量，而且不通过参数表传递该全局变量的信息
  // 控制耦合：模块之间传递的不是数据信息，而是控制信息例如标志、开关量等，一个模块控制了另一个模块的功能
  // 标记耦合：调用模块和被调用模块之间传递数据结构而不是简单数据
  // 数据耦合：调用模块和被调用模块之间只传递简单的数据项参数
  // 非直接耦合：两个模块之间没有直接关系，它们之间的联系完全通过主模块调度

  // 内聚
  // 偶然内聚
  // 逻辑内聚
  // 时间内聚
  // 通信内聚
  // 顺序内聚
  // 功能内聚


  // 非多态
  var makeSound = function(animal) {
    if(animal instanceof Duck) {
      console.log('嘎嘎嘎');
    } else if (animal instanceof Chicken) {
      console.log('咯咯咯');
    }
  }

  var Duck = function(){}
  var Chiken = function() {};

  makeSound(new Chicken());
  makeSound(new Duck());

  // 多态
  var makeSound = function(animal) {
    animal.sound();
  }

  var Duck = function(){}
  Duck.prototype.sound = function() {
    console.log('嘎嘎嘎')
  }
  var Chiken = function() {};
  Chiken.prototype.sound = function() {
    console.log('咯咯咯')
  }

  makeSound(new Chicken());
  makeSound(new Duck());




  // 创建型模式：
  // 单例模式
  // 工厂模式
  // 抽象工厂模式
  // 建造者模式
  // 原型模式

  // 结构型设计：
  // 外观模式：为一组复杂的子系统接口提供一个更高级的统一接口，通过这个接口使得对子系统的接口访问更容易；客户端不与系统耦合，外观类与系统耦合
  // 适配器模式：把一个类的接口变换成客户端所期待的另一种接口，从而使原本接口不匹配而无法一起工作的两个类能够在一起工作
    // 被替换类
    class Target {
      g() {}
    }
    // 源类/被适配类
    class Adaptee {
      specificG() {}
    }
    // 适配器
    class Adapter extends Adaptee {
      g() {
        this.specificG()
      }
    }
    // 目标类/具体使用类
    class AdapterPattern {
      main() {
        new Adapter().g()
      }
    }
  // 代理模式：给某一个对象提供一个代理对象，并由代理对象控制对原对象的引用，起到中介作用
  // 装饰者模式：在不改变原对象结构的基础上，对其添加新功能，可以返回新类（代理类），也可以返回原类
  // 桥接模式/柄体模式/接口模式：将抽象部分与它的实现部分分离，使它们都可以独立地变化，应对对象的“多维度的变化”
  //   由抽象化角色和修正抽象化角色组成的抽象化等级结构。
  //   由实现化角色和两个具体实现化角色所组成的实现化等级结构。
  //   桥梁模式所涉及的角色有：
  //   抽象化(Abstraction)角色：抽象化给出的定义，并保存一个对实现化对象的引用。
  //   修正抽象化(Refined Abstraction)角色：扩展抽象化角色，改变和修正父类对抽象化的定义。
  //   实现化(Implementor)角色：这个角色给出实现化角色的接口，但不给出具体的实现。必须指出的是，这个接口不一定和抽象化角色的接口定义相同，实际上，这两个接口可以非常不一样。实现化角色应当只给出底层操作，而抽象化角色应当只给出基于底层操作的更高一层的操作。
  //   具体实现化(Concrete Implementor)角色：这个角色给出实现化角色接口的具体实现
    /** "Implementor" 实现化 */
    interface DrawingAPI{    
      public void drawCircle(double x, double y, double radius);
    }
    /** "ConcreteImplementor" 具体实现化 1/2 */
    class DrawingAPI1 implements DrawingAPI{   
      public void drawCircle(double x, double y, double radius)    {        
        System.out.printf("API1.circle at %f:%f radius %f\n", x, y, radius);   
      }
    }
    /** "ConcreteImplementor" 具体实现化 2/2 */
    class DrawingAPI2 implements DrawingAPI{   
      public void drawCircle(double x, double y, double radius)    {         
        System.out.printf("API2.circle at %f:%f radius %f\n", x, y, radius);   
      }
    }
    /** "Abstraction" 抽象化 */ 
    interface Shape{   
      public void draw();
    }
    /** "Refined Abstraction" 修正抽象化 */
    class CircleShape implements Shape{   
      private double x, y, radius;   
      private DrawingAPI drawingAPI;   
      public CircleShape(double x, double y, double radius, DrawingAPI drawingAPI)   {       
        this.x = x;  
        this.y = y;  
        this.radius = radius;        
        this.drawingAPI = drawingAPI;   
      }   // low-level i.e. Implementation specific   
      public void draw()   {        
        drawingAPI.drawCircle(x, y, radius);  
      }      // high-level i.e. Abstraction specific   
      public void resizeByPercentage(double pct)   {        
        radius *= pct;   
      }
    }
    /** "Client" */
    class BridgePattern {
      public static void main(String[] args)   {
        Shape[] shapes = new Shape[2];       
        shapes[0] = new CircleShape(1, 2, 3, new DrawingAPI1());       
        shapes[1] = new CircleShape(5, 7, 11, new DrawingAPI2());       
        for (Shape shape : shapes)       {           
          shape.resizeByPercentage(2.5);           
          shape.draw();       
        }   
      }
    }

    public abstract class Abstraction {

    private Implementor imp;

    //约束子类必须实现该构造函数
    public Abstraction(Implementor imp) {
        this.imp = imp;
    }

    public Implementor getImp() {
        return imp;
    }

    //自身的行为和属性
    public void request() {
        this.imp.doSomething();
    }

    }
        
    public abstract class Implementor {

      public abstract void doSomething();
      public abstract void doAnything();

    }

    public class ConcreteImplementorA extends Implementor {

      @Override
      public void doSomething() {
          System.out.println("具体实现A的doSomething执行");
      }

      @Override
      public void doAnything() {
          System.out.println("具体实现A的doAnything执行");
      }
    }

    public class RefinedAbstraction extends Abstraction {

      //覆写构造函数
      public RefinedAbstraction(Implementor imp) {
          super(imp);
      }

      //修正父类行为
      @Override
      public void request() {
          super.request();
          super.getImp().doAnything();
      }

    }

    public class Client {

      public static void main(String[] args) {
          Implementor imp = new ConcreteImplementorA();
          Abstraction abs = new RefinedAbstraction(imp);
          abs.request();
      }

    }
    组合模式：将对象组合成树形结构以表示“部分-整体”的层次结构
      public class Client {

        public static void main(String[] args) {
            //创建根节点及其子节点
            Composite root = new Composite("root");
            root.add(new Leaf("Leaf A"));
            root.add(new Leaf("Leaf B"));

            //创建第二层节点及其子节点
            Composite branch = new Composite("Composite X");
            branch.add(new Leaf("Leaf XA"));
            branch.add(new Leaf("Leaf XB"));
            root.add(branch);

            //创建第三层节点及其子节点
            Composite branch2 = new Composite("Composite XY");
            branch2.add(new Leaf("Leaf XYA"));
            branch2.add(new Leaf("Leaf XYB"));
            branch.add(branch2);

            //创建第二层节点
            root.add(new Leaf("Leaf C"));

            //创建第二层节点并删除
            Leaf leaf = new Leaf("Leaf D");
            root.add(leaf);
            root.remove(leaf);

            //打印
            root.display(1);
        }

      }
    享元模式：运用共享技术有效的支持大量细粒度的对象
      内蕴状态存储在享元内部，不会随环境的改变而有所不同，是可以共享的
      外蕴状态是不可以共享的，它随环境的改变而改变的，因此外蕴状态是由客户端来保持（因为环境的变化是由客户端引起的）
  
    行为型设计模式：
    观察者模式（发布订阅模式）：一个对象状态改变，所有的依赖对象都将得到通知
      subscribe publish dispatch ?observer
    
    模板方法模式：定义了一个算法的步骤，并允许子类别为一个或多个步骤提供其实践方式。让子类别在不改变算法架构的情况下，重新定义算法中的某些步骤（最终调用父类方法）
    命令模式：
      public class Client {
  2 
  3     public static void main(String[] args) {
  4         //定义接收者
  5         Receiver receiver = new Receiver();
  6         //定义一个发送给接收者的命令
  7         Command command = new ConcreteCommand(receiver);
  8         //声明调用者
  9         Invoker invoker = new Invoker();
  10         
  11         //把命令交给调用者执行
  12         invoker.setCommand(command);
  13         invoker.executeCommand();
  14     }
  15     
  16 }
    状态模式：当一个对象的内在状态改变时允许改变其行为，这个对象看起来像是改变了其类
    一个对象的行为取决于它的状态，并且它必须在运行时刻根据状态改变它的行为
      即把状态对象声明为静态常量，有几个状态对象就声明几个状态常量
      环境角色具有状态抽象角色定义的所有行为，具体执行使用委托方式
      public class Client {
  2 
  3     public static void main(String[] args) {
  4         Context context = new Context();
  5         
  6         //定义初始状态为关门（共四种初始值）
  7         context.setLiftState(new ClosingState());
  8         context.open();
  9         context.close();
  10         context.run();
  11         context.stop();
  12     }
  13     
  14 }
    职责链模式（责任链模式）：把可以响应请求的对象组织成一条链，并在这条链上传递请求，从而保证多个对象都有机会处理请求并可以避免请求方和响应方的紧密耦合
    public class Client {

      public static void main(String[] args) {
          CommonManager commonManager = new CommonManager("尼古拉斯·经理");
          Majordomo majordomo = new Majordomo("尼古拉斯·总监");
          GeneralManager generalManager = new GeneralManager("尼古拉斯·总经理");

          //设置上级
          commonManager.setSuperior(majordomo);
          majordomo.setSuperior(generalManager);

          Request request = new Request();
          request.setRequestType("请假");
          request.setRequestContent("adam请假");
          request.setNumber(1);
          commonManager.handlerRequest(request);
      }
    }
    解释器模式：(参考语言解释器原理)
    中介者模式：用一个中介对象来封装一系列的对象交互,中介者使各个对象不需要显式地相互引用，从而使其耦合松散，而且可以独立地改变它们之间的交互
    访问者模式：表示一个作用于某对象结构中的各元素的操作。它使你可以在不改变各元素类的前提下定义作用于这些元素的新操作
    策略模式（政策模式）：策略模式定义了一系列的算法，并将每一个算法封装起来，而且使它们还可以相互替换。策略模式让算法独立于使用它的客户而独立变化
      public class Client {

        public static void main(String[] args) {
            Context context;

            context = new Context(new ConcreteStrategyA());
            context.contextInterface();

            context = new Context(new ConcreteStrategyB());
            context.contextInterface();

            context = new Context(new ConcreteStrategyC());
            context.contextInterface();
        }

      }
    备忘录模式：在不破坏封装性的前提下，捕获一个对象的内部状态，并在该对象之外保存着这个状态。这样以后就可将该对象恢复到原先保存的状态
    迭代器模式：(参考语言迭代器原理)

  需求：
    功能性需求
    非功能性需求
      执行质量 性能
        延迟 
        安全
        吞吐 ...
      演化质量
        可测试性（在设计中考虑可测试性，就是在设计时问一下，这个函数/模块/系统怎么测，在软件开发中，只有把一个一个的小模块做了足够的测试，我们才会有稳定的构造块，才可以在集成测试的时候，只关注最终的结果） 
        可拓展性 
        可维护性

  编程范式：
    非结构化：汇编 线性代码 不利于复杂程序 难以维护 功能无法被分解
    结构化：解决非结构化编程的缺点 但是抽象级别还不够高
    面向对象：一种更好的组织代码的方式
      封装：
        要设计出一个一个可以组合，可以复用的单元
        先考虑类的行为，根据行为提供对应方法，最后考虑实现这些方法需要哪些字段；行为的命名要突出意图，而不是实现
        不变类 不要暴露实现细节 减少对外暴露的接口 (public private)
        高内聚低耦合
      继承：实现继承，接口继承
      多态：构建抽象，会以接口的形式体现出来；接口将变的部分和不变的部分隔离开来：不变的是接口约定，变的是子类实现。适应未来变化
    函数式：
    技巧型设计模式：
    链模式：通过在对象方法中将当前对象返回，实现对同一个对象多个方法的链式调用。从而简化对该对象的多个方法的多次调用，对该对象的多次引用
    委托模式：多个对象接收并处理同一请求，他们将请求委托给另一个对象统一处理请求
    数据访问对象模式：抽象和封装对数据源的访问与存储，DAO通过对数据源链接的管理方便对数据的访问与存储
    节流模式：对重复的业务逻辑进行节流控制，执行最后一次操作并取消其他操作，以提高性能
    简单模版模式：通过格式化字符串拼凑出视图避免创建视图时大量节点操作。优化内存开销
    惰性模式：减少每次代码执行时的重复性的分支判断，通过对对象重定义来屏蔽原对象中的分支判断
      解决每次执行判断：
      变量定义为自执行函数；
      执行时覆盖函数；
    参与者模式：在特定的作用域中执行给定的函数，并将参数原封不动地传递
    等待者模式：(参考Promise.all实现)

    架构型设计模式：
    同步模块：（参考reqiurejs）
    异步模块：（参考reqiurejs）
    Widget：
    MVC：
    MVP：
    MVVM：


  </script>
  
</body>
</html>
